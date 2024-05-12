import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import { useRouter, useLocalSearchParams } from "expo-router";
import MessageList from '../../components/MessageList';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import io from 'socket.io-client';

export default function ChatRoom() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { user, getMessages, messages } = useAuth();
  const params = useLocalSearchParams();

  const socket = io('http://192.168.15.5:3000'); // Conecte-se ao servidor

  useEffect(() => {
    // Desconecte o socket quando o componente for desmontado
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    await getMessages(user, params.idConversation);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function sendMessage() {
    if (message) {
      try {
        const formData = new FormData();
        formData.append('message', message);
  
        const response = await axios.post(
          `http://192.168.15.5:8080/chat/create/${params.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer Authorization ${user.token}` // Correção no cabeçalho de autorização
            }
          }
        );

        // Notifique o servidor sobre a nova mensagem enviada
        socket.emit('message', { message: message });

        setMessage('');

        // Atualize a lista de mensagens
        await getMessages(user, params.idConversation);
      } catch (error) {
        console.log(error);
        // Trate os erros de forma apropriada, se necessário
      }
    }
  }

  // Quando uma nova mensagem é recebida do servidor, atualize a interface do usuário
  socket.on('message', (data) => {
    fetchMessages();
  });

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1">
        <StatusBar style="dark" />
        <ChatRoomHeader router={router} user={{ name: params.name }} />
        <View className="h-3 border-b border-neutral-800" />
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible" style={{ backgroundColor: "#121212" }}>
          <View className="flex-1">
            <MessageList messages={messages} currentUser={{ userId: user.id }} />
          </View>
          <View style={{ marginBottom: hp(2.7) }} className="pt-2">
            <View style={{ backgroundColor: "#1e1e1e" }} className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-600 rounded-full pl-5">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Digite uma mensagem..."
                placeholderTextColor="#e3e3e3"
                style={{ fontSize: hp(2), backgroundColor: "tranparent", color: "#e3e3e3" }}
                className="flex-1 mr-2"
              />
              <TouchableOpacity onPress={sendMessage} className="bg-neutral-100 p-2 mr-[1px] rounded-full">
                <Feather name="send" size={hp(2.7)} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}