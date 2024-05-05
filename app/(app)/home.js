import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

export default function Home() {
   const [users, setUsers] = useState([]);
   const [conversation, setConversation] = useState([]);
   const { user } = useAuth();

   useEffect(() => {
      const fetchConversation = async () => {
         const conversation = await getConvesations();
         setConversation(conversation);
      }

      fetchConversation();
   }, [])

   const getConvesations = async () => {
      try {
         const response = await axios.get(
            'https://d941-2804-7f0-b902-fd18-cc65-a762-55ba-e71b.ngrok-free.app/chat/conversation/by-user',
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