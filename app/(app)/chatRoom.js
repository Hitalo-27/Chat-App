import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import { useRouter, useLocalSearchParams } from "expo-router";
import MessageList from '../../components/MessageList';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

export default function ChatRoom() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const message = useRef("");
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const getMessages = async () => {
    try {
      const response = await axios.get(
        `https://d941-2804-7f0-b902-fd18-cc65-a762-55ba-e71b.ngrok-free.app/chat/messages/${params.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer Authorization ${user.token}`
          },
        }
      );

      return response.data.message;
    } catch (error) {
      return [];
    }
  }

  const fetchMessages = async () => {
    const messagesTeste = await getMessages();
    setMessages(messagesTeste);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function sendMessage() {
    if (message.current) {
      try {
        const response = await axios.post(
          `https://d941-2804-7f0-b902-fd18-cc65-a762-55ba-e71b.ngrok-free.app/chat/create/${user.id}`,
          {
            message: message.current
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer Authorization ${user.token}`
            }
          }
        );
        const messagesTeste = await getMessages();
        setMessages(messagesTeste);
      } catch (error) {
        console.log(error);
      }
    }
  }

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
                onChangeText={value => message.current = value}
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