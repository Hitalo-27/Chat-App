import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';


export default function Home() {
   const [users, setUsers] = useState([1,2,3]);
   
   useEffect(() => {
      // if(user?.uid)
      //    getUsers();
   },[])

   const getUsers = async () => {

   }
   return (
      <View className="flex-1 bg-white">
         <StatusBar style="dark" />

         {
            users.length > 0 ? (
               <ChatList users={users} />
            ):(
            <View className="flex-1 items-center" style={{ top: hp(30) }} >
               <Loading size={hp(10)} />
            </View>
         )
        }
      </View>
   );
}