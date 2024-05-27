import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import axios from 'axios';
import Loading from '../../components/Loading';
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
            'https://aps-redes-service.onrender.com/user/all',
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
      <View className="flex-1" style={{ backgroundColor: '#121212' }}>
         <StatusBar style="dark" />
         {users.length > 0 ? (
            <ChatList users={users} isConversation={false} />
         ) : (
            <View style={{ flex: 1, paddingTop: hp('40%'), alignItems: 'center' }}>
               <Loading size={hp(6.5)} />
            </View>
         )}
      </View>
   );
}