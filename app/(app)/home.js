import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

export default function Home() {
   const [conversation, setConversation] = useState([]);
   const { user, messages } = useAuth();

   useEffect(() => {
      const fetchConversation = async () => {
         const conversation = await getConvesations();
         setConversation(conversation);
      }

      fetchConversation();
   }, [messages]);

   const getConvesations = async () => {
      try {
         const response = await axios.get(
            'http://192.168.15.5:8080/chat/conversation/by-user',
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer Authorization ${user.token}`
               },
            }
         );

         return response.data.message;
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