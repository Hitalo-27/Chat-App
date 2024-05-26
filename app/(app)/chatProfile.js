import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import { Entypo } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import MembersList from '../../components/MembersList';
import { AlertNotificationRoot } from 'react-native-alert-notification';

export default function ChatProfile() {
   const params = useLocalSearchParams();
   const [conversation, setConversation] = useState(JSON.parse(params.user));
   const [users, setUsers] = useState([]);
   const router = useRouter();
   const { user, removeUserGroup } = useAuth();

   const [imageUri, setImageUri] = useState(`http://192.168.15.11:8080/${conversation ? conversation.imageName : ''}`);
   const fallbackImageUri = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

   const handleImageError = () => {
      setImageUri(fallbackImageUri);
   };

   const handleUsers = async () => {
      try {
         const response = await axios.get(
            `http://192.168.15.11:8080/group/members/${conversation.idConversation}`,
            {
               headers: {
                  'Authorization': `Bearer Authorization ${user.token}`
               }
            }
         );

         setUsers(response.data.message);
         return;
      } catch (error) {
         console.log(error.response.data);
         return;
      }
   };

   useEffect(() => {
      handleUsers();
   }, [conversation, removeUserGroup]);

   return (
      <View className="flex-1" style={{ backgroundColor: '#121212' }}>
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
                           {conversation.name || 'Usuário'}
                        </Text>
                     </View>
                  </View>
               ),
            }}
         />
         <View className="items-center">
            <Image
               source={{ uri: imageUri }}
               style={{ height: hp(15), width: hp(15), borderRadius: 100, marginTop: hp(10) }}
               onError={handleImageError}
            />
         </View>

         <View>
            <View className="gap-2">
               <View className="flex-row items-center justify-center gap-4">
                  <Text style={{ fontSize: hp(3) }} className="font-medium text-neutral-100">
                     {conversation.name || 'Usuário'}
                  </Text>
               </View>
               {conversation.groupConversation === 'true' ? (
                  <View className="flex-row items-center justify-center gap-4">
                     <Text style={{ fontSize: hp(2) }} className="font-medium text-neutral-100">
                        Total de Membros: {users.length}
                     </Text>
                  </View>
               ) : (
                  <View className="flex-row items-center justify-center gap-4">
                     <Text style={{ fontSize: hp(2) }} className="font-medium text-neutral-100">
                        Email: {conversation.email || 'Sem Email'}
                     </Text>
                  </View>
               )}
            </View>
         </View>

         {conversation.groupConversation === 'true' && (
            <View className="flex-1 p-4">
               <FlatList
                  data={users}
                  contentContainerStyle={{ flex: 1, paddingVertical: 25, backgroundColor: '#121212' }}
                  keyExtractor={item => Math.random()}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item, index }) =>
                     <MembersList
                        noBorder={index + 1 == users.length}
                        router={router}
                        item={item}
                        index={index}
                        conversationId={conversation.idConversation}
                     />
                  }
               />
            </View>
         )}
         <AlertNotificationRoot colors={[{
            label: 'white',
            card: '#121212',
            overlay: 'white',
            success: '#581c87',
            danger: 'red',
            warning: 'yellow',
         }]} />
      </View>
   );
}