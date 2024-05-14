import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

export default function Contacts() {
   const [users, setUsers] = useState([]);
   const { user } = useAuth();

   useEffect(() => {
      const fetchUsers = async () => {
         const user = await getUsers();
         setUsers(user);
      }

      fetchUsers();
   }, [])

   const getUsers = async () => {
      try {
         const response = await axios.get(
            'http://192.168.15.9:8080/user/all',
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
         <ChatList users={users} isConversation={false} />
      </View>
   );
}