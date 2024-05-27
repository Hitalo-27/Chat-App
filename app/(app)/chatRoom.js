import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import { useRouter, useLocalSearchParams } from "expo-router";
import MessageList from '../../components/MessageList';
import { AntDesign, Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Inicialize o socket fora do componente para garantir que ele seja inicializado apenas uma vez
const socket = io('http://192.168.15.11:3000');

export default function ChatRoom() {
  const router = useRouter();
  const [media, setMedia] = useState(null);
  const [mediaCompleted, setMediaCompleted] = useState(null);
  const [messageAtual, setMessageAtual] = useState('');
  const { user, getMessages, messages, setMessages } = useAuth();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef(null);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', updateScrollView
    );

    // Adicione o listener para a mensagem
    const handleMessage = (data) => {
      fetchMessages();
    };

    socket.on('message', handleMessage);

    return () => {
      keyboardDidShowListener.remove();
      // Remova o listener ao desmontar o componente
      socket.off('message', handleMessage);
    };
  }, []);

  const fetchMessages = async () => {
    await getMessages(user, params);
  }

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 10);
  }

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaCompleted(result.assets[0]);
    }
  };

  async function sendMessage(audioTeste = null) {
    if (messageAtual || mediaCompleted || audioTeste) {
      try {
        setLoading(true);
        let uri = null;
        let type = null;
        let name = null;

        if (mediaCompleted) {
          uri = mediaCompleted.uri;
          type = mediaCompleted.type === 'video' ? 'video/mp4' : 'image/jpeg';
          name = mediaCompleted.type === 'video' ? 'video.mp4' : 'image.jpg';

          if (mediaCompleted.type === 'image') {
            // Comprimir a imagem antes de enviá-la
            const compressedImage = await ImageManipulator.manipulateAsync(
              uri,
              [],
              { compress: 0.7, format: 'jpeg' } // Comprimir a imagem com qualidade de 70%
            );
            uri = compressedImage.uri;
          }
        }

        const formData = new FormData();
        formData.append('message', messageAtual);
        if (uri) {
          formData.append('file', {
            uri: uri,
            name: name,
            type: type,
          });
        } else if (audioTeste) {
          formData.append('file', {
            uri: audioTeste,
            name: 'audio.m4a',
            type: 'audio/m4a',
          });
        }

        let typeRequest = "";
        let idChat = "";
        if (params.groupConversation === "true") {
          typeRequest = "group";
          idChat = params.idConversation;
        } else {
          typeRequest = "chat";
          idChat = params.id;
        }

        const response = await axios.post(
          `http://192.168.15.11:8080/${typeRequest}/create/${idChat}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer Authorization ${user.token}`
            }
          }
        );

        // Notifique o servidor sobre a nova mensagem enviada
        socket.emit('message', { message: messageAtual });

        setMessageAtual('');
        setMedia(null);
        setMediaCompleted(null);

        let novaMessage = {
          message: response.data.message.message,
          id: response.data.message.id,
          conversationId: response.data.message.conversationId.id,
          conversationCreatedAt: response.data.message.conversationId.createdAt,
          recipientId: response.data.message.recipientId.id,
          imageName: response.data.message.imageName,
          createdAt: response.data.message.createdAt,
          senderId: response.data.message.senderId.id,
        }

        // Atualize a lista de mensagens
        setMessages([...messages, novaMessage]);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    const mp4Uri = uri.replace('.m4a', '.mp4'); // Renomeando para .mp4

    try {
      await FileSystem.moveAsync({
        from: uri,
        to: mp4Uri,
      });
      console.log('Recording URI:', mp4Uri);
      await sendMessage(mp4Uri);
    } catch (error) {
      console.error('Failed to rename and send recording', error);
    }
  }

  async function excluseRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
  }

  function excluseImage() {
    setMedia(null);
    setMediaCompleted(null);
  }

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1">
        <StatusBar style="dark" />
        <ChatRoomHeader router={router} user={{ user: params }} />
        <View className="h-3 border-b border-neutral-800" />
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible" style={{ backgroundColor: "#121212" }}>
          <View className="flex-1">
            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={{ userId: user.id }} />
          </View>
          {media && (
            <View className="flex-row items-center justify-center p-2 mx-3" style={{ width: wp(30), height: hp(10) }}>
              <Image
                source={{ uri: media }}
                style={{ width: '100%', height: '100%' }}
                className="rounded-lg"
              />
              <TouchableOpacity onPress={excluseImage} className="absolute top-0 right-0 rounded-full">
                <AntDesign name="closecircle" size={24} color="#581c87" />
              </TouchableOpacity>
            </View>
          )}
          <View style={{ marginBottom: hp(2.7) }} className="pt-2">
            <View style={{ backgroundColor: "#1e1e1e" }} className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-600 rounded-full pl-5">
              <TextInput
                value={messageAtual}
                onChangeText={setMessageAtual}
                placeholder="Digite uma mensagem..."
                placeholderTextColor="#e3e3e3"
                style={{ fontSize: hp(2), backgroundColor: "transparent", color: "#e3e3e3" }}
                className="flex-1 mr-2"
              />
              {
                loading ? (
                  <View className="flex-row justify-center">
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                ) : (
                  <>
                    {recording ? (
                      <TouchableOpacity onPress={excluseRecording} className="bg-neutral-100 p-2 mr-[4px] rounded-full">
                        <AntDesign name="delete" size={hp(2.7)} color="red" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={pickMedia} className="p-2 mr-[4px] rounded-full">
                        <Feather name="camera" size={hp(2.7)} color="white" />
                      </TouchableOpacity>
                    )}
                    {messageAtual || mediaCompleted ? (
                      <TouchableOpacity onPress={() => sendMessage(null)} className="bg-neutral-100 p-2 mr-[1px] rounded-full">
                        <Feather name="send" size={hp(2.7)} color="black" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={recording ? stopRecording : startRecording} className="bg-neutral-100 p-2 mr-[1px] rounded-full">
                        {recording ? (
                          <Feather name="stop-circle" size={hp(2.7)} color="red" />
                        ) : (
                          <Feather name="mic" size={hp(2.7)} color="black" />
                        )}
                      </TouchableOpacity>
                    )}
                  </>
                )}
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}