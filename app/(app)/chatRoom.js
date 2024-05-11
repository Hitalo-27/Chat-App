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
  const message = useRef("");
  const { user, getMessages, messages } = useAuth();
  const params = useLocalSearchParams();

  const fetchMessages = async () => {
    await getMessages(user, params.idConversation);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function sendMessage() {
    if (message.current) {
      try {
        const formData = new FormData();
        formData.append('message', message.current);
  
        const response = await axios.post(
          `https://109f-2804-7f0-b902-fd18-e017-b6d7-6d7e-d35a.ngrok-free.app/chat/create/${params.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer Authorization ${user.token}`
            }
          }
        );
  
        await getMessages(user, params.idConversation);

        message.current = "";
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