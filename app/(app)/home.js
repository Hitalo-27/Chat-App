import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import ChatList from '../../components/ChatList';
import axios from 'axios';
import { useRouter } from "expo-router";
import { useAuth } from '../../context/authContext';
import io from 'socket.io-client';

const socket = io('https://server-chat-app-nfhd.onrender.com');

export default function Home() {
   const [conversation, setConversation] = useState([]);
   const { user, messages } = useAuth();
   const router = useRouter();

   useEffect(() => {
      const fetchConversation = async () => {
         const conversation = await getConvesations();
         setConversation(conversation);
      }

      fetchConversation();

      const handleMessage = (data) => {
         fetchConversation();
      };
      
      socket.on('message', handleMessage);

      if (!messages) {
         router.replace("contacts");
      }
   }, [messages]);

   const getConvesations = async () => {
      try {
         const responseUsers = await axios.get(
            'https://aps-redes-service.onrender.com/chat/conversation/by-user',
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer Authorization ${user.token}`
               },
            }
         );

         const responseGroups = await axios.get(
            'https://aps-redes-service.onrender.com/group/conversation/by-user',
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer Authorization ${user.token}`
               },
            }
         );

         const response = responseUsers.data.message.concat(responseGroups.data.message);

         setConversation(response);
         return response;
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <View className="flex-1" style={{ backgroundColor: '#121212' }}>
         <StatusBar style="dark" />
         <ChatList users={conversation} />
      </View>
   );
}