import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { Entypo } from '@expo/vector-icons';

export default function AddUsersGroup() {
   const [users, setUsers] = useState([]);
   const { user } = useAuth();
   const router = useRouter();

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
            'http://192.168.15.8:8080/user/all',
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
         <Stack.Screen
            options={{
               title: '',
               headerShadowVisible: false,
               headerStyle: {
                  backgroundColor: '#581c87',
               },
               headerLeft: () => (
                  <View className="flex-row items-center gap-4">
                     <TouchableOpacity onPress={() => router.back()}>
                        <Entypo name="chevron-left" size={hp(4)} color="#e3e3e3" />
                     </TouchableOpacity>
                     <View className="flex-row items-center gap-3">
                        <Text style={{ fontSize: hp(2.5) }} className="font-medium text-neutral-100">
                           Criar grupo
                        </Text>
                     </View>
                  </View>
               ),
            }}
         />
         <ChatList users={users} isConversation={false} isGroup={true} />
      </View>
   );
}