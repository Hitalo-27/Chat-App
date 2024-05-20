import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import ChatList from '../../components/ChatList';
import axios from 'axios';
import { useRouter } from "expo-router";
import { useAuth } from '../../context/authContext';

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

      if (!messages) {
         router.replace("contacts");
      }
   }, [messages]);

   const getConvesations = async () => {
      try {
         const responseUsers = await axios.get(
            'http://192.168.15.11:8080/chat/conversation/by-user',
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer Authorization ${user.token}`
               },
            }
         );

         const responseGroups = await axios.get(
            'http://192.168.15.11:8080/group/conversation/by-user',
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
      <View className="flex-1 bg-white">
         <StatusBar style="dark" />
         <ChatList users={conversation} />
      </View>
   );
}