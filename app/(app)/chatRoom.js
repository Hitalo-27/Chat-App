import React, { useState } from 'react';
import { StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import { useRouter } from "expo-router";
import MessageList from '../../components/MessageList';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomKeyboardView from '../../components/CustomKeyboardView';

export default function ChatRoom() {
  const router = useRouter();
  // const [messages, setMessages] = useState([]);
  const messages = [
    {
      index: 0,
      text: 'Mensagem Teste do Teste 1',
      userId: 1,


    },
    {
      index: 1,
      text: 'Mensagem Teste2',
      userId: 2,

    },
    {
      index: 3,
      text: 'Mensagem Teste 3',
      userId: 1,


    },
    {
      index: 4,
      text: 'Mensagem Teste do teste 4',
      userId: 2,

    },
  ];
  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1">
        <StatusBar style="dark" />
        <ChatRoomHeader router={router} />
        <View className="h-3 border-b border-neutral-800" />
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible" style={{ backgroundColor: "#121212" }}>
          <View className="flex-1">
            <MessageList messages={messages} currentUser={{ userId: 1 }} />
          </View>
          <View style={{ marginBottom: hp(2.7) }} className="pt-2">
            <View style={{ backgroundColor: "#1e1e1e" }} className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-600 rounded-full pl-5">
              <TextInput
                placeholder="Digite uma mensagem..."
                placeholderTextColor="#e3e3e3"
                style={{ fontSize: hp(2), backgroundColor: "tranparent", color: "#e3e3e3" }}
                className="flex-1 mr-2"
              />
              <TouchableOpacity className="bg-neutral-100 p-2 mr-[1px] rounded-full">
                <Feather name="send" size={hp(2.7)} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}