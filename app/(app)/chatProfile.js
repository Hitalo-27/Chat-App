import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import MembersList from '../../components/MembersList';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ChatProfile() {
   const params = useLocalSearchParams();
   const [imageCompleted, setImageCompleted] = useState(null);
   const [conversation, setConversation] = useState(JSON.parse(params.user));
   const [users, setUsers] = useState([]);
   const router = useRouter();
   const { user, removeUserGroup } = useAuth();
   const [title, setTitle] = useState(conversation.name);
   const [description, setDescription] = useState(conversation.groupDescription !== 'undefined' ? conversation.groupDescription : '');
   const [image, setImage] = useState(null);
   const [imageUri, setImageUri] = useState(`https://drive.google.com/uc?id=${conversation ? conversation.imageName ? JSON.parse(conversation.imageName).id : '' : ''}`);
   const fallbackImageUri = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
   const [loading, setLoading] = useState(false);

   const handleImageError = () => {
      setImageUri(fallbackImageUri);
   };

   const handleUsers = async () => {
      try {
         const response = await axios.get(
            `https://aps-redes-service.onrender.com/group/members/${conversation.idConversation}`,
            {
               headers: {
                  'Authorization': `Bearer Authorization ${user.token}`
               }
            }
         );

         setUsers(response.data.message);
      } catch (error) {
         console.log(error.response.data);
      }
   };

   useEffect(() => {
      handleUsers();
   }, [conversation, removeUserGroup]);

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.canceled) {
         setImage(result.assets[0].uri);
         setImageCompleted(result.assets[0]);
      }
   };

   const addUsersGroup = async () => {
      try {
         const response = await axios.get(
            `https://aps-redes-service.onrender.com/group/get/not-members/${conversation.idConversation}`,
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer Authorization ${user.token}`
               },
            }
         );


         if (response.data.message.length > 0) {
            router.push(
               {
                  pathname: 'addUsersGroup',
                  params: {
                     usersNotGroup: JSON.stringify(response.data.message),
                     idConversationAdd: conversation.idConversation
                  }
               });
         } else {
            Dialog.show({
               type: ALERT_TYPE.DANGER,
               title: 'Atenção!',
               textBody: "Todos os usuários cadastrados já estão no grupo!",
               button: 'Ok',
            });
         }

      } catch (error) {
         console.log(error);
      }
   };

   const updateGroup = async () => {
      try {
         setLoading(true);
         const formData = new FormData();
         formData.append('title', title);
         formData.append('description', description);
         if (imageCompleted) {
            uri = imageCompleted.uri;

            // Comprimir a imagem antes de enviá-la
            const compressedImage = await ImageManipulator.manipulateAsync(
               uri,
               [],
               { compress: 0.7, format: 'jpeg' } // Comprimir a imagem com qualidade de 70%
            );
            uri = compressedImage.uri;

            if (uri) {
               formData.append('file', {
                  uri: uri,
                  name: 'image.jpg',
                  type: 'image/jpeg',
               });
            }
         }

         const response = await axios.put(
            `https://aps-redes-service.onrender.com/group/update/${conversation.idConversation}`,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer Authorization ${user.token}`
               }
            }
         );

         setConversation({
            ...conversation,
            name: response.data.message.title,
            groupDescription: response.data.message.description,
            imageName: response.data.message.imageName
         });

         Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Sucesso!',
            textBody: "Dados atualizados com sucesso!",
            button: 'Ok',
         });
         return;

      } catch (error) {
         console.log(error);

         Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Erro!',
            textBody: "Ocorreu um erro ao atualizar os dados!",
            button: 'Ok',
         });

         return;
      } finally {
         setLoading(false);
      }
   }

   return (
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
         <StatusBar style="dark" />
         <Stack.Screen
            options={{
               title: '',
               headerShadowVisible: false,
               headerStyle: {
                  backgroundColor: '#581c87',
               },
               headerLeft: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                     <TouchableOpacity onPress={() => router.back()}>
                        <Entypo name="chevron-left" size={hp(4)} color="#e3e3e3" />
                     </TouchableOpacity>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ fontSize: hp(2.5), fontWeight: 'bold', color: '#FFFFFF' }}>
                           {conversation.name || 'Usuário'}
                        </Text>
                     </View>
                  </View>
               ),
            }}
         />
         <View style={{ alignItems: 'center' }}>
            {conversation.groupConversation === 'true' ? (
               <>
                  <TouchableOpacity onPress={addUsersGroup} style={{ backgroundColor: '#581c87', position: 'absolute', left: 20, padding: 10, borderRadius: 10, marginTop: hp(5) }}>
                     <AntDesign name="pluscircleo" size={24} color="white" />
                  </TouchableOpacity>
                  {loading ? (
                     <View style={{ backgroundColor: '#581c87', position: 'absolute', right: 20, padding: 10, borderRadius: 10, marginTop: hp(5) }}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                     </View>
                  ) : (
                     <TouchableOpacity onPress={updateGroup} style={{ backgroundColor: '#581c87', position: 'absolute', right: 20, padding: 10, borderRadius: 10, marginTop: hp(5) }}>
                        <Text style={{ fontSize: hp(2), color: '#FFFFFF' }}>Salvar</Text>
                     </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={pickImage}>
                     <Image
                        source={image ? { uri: image } : { uri: imageUri }}
                        style={{ height: hp(20), width: hp(20), borderRadius: 100, marginTop: hp(5) }}
                        onError={handleImageError}
                     />
                     <View style={{ position: 'absolute', bottom: 0, right: 0, padding: 10, borderRadius: 100, backgroundColor: '#581c87' }}>
                        <Feather name="camera" size={24} color="white" />
                     </View>
                  </TouchableOpacity>
               </>
            ) : (
               <Image
                  source={{ uri: imageUri }}
                  style={{ height: hp(15), width: hp(15), borderRadius: 100, marginTop: hp(10) }}
                  onError={handleImageError}
               />
            )}
         </View>

         <View style={{ marginBottom: 10, marginTop: 20, gap: 10, alignItems: 'center' }}>
            {conversation.groupConversation === 'true' ? (
               <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                     <TextInput
                        value={title}
                        onChangeText={setTitle}
                        style={{ fontSize: hp(3) }}
                        className="font-bold text-white text-center border-b border-purple-900"
                        placeholder="Titulo"
                        placeholderTextColor={'gray'}
                     />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                     <TextInput
                        value={description}
                        onChangeText={setDescription}
                        style={{ fontSize: hp(2.5) }}
                        className="font-semibold text-white text-center border-b border-purple-900"
                        placeholder="Descrição"
                        placeholderTextColor={'gray'}
                     />
                  </View>
               </>
            ) : (
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Text style={{ fontSize: hp(3), fontWeight: 'bold', color: '#FFFFFF' }}>
                     {conversation.name || 'Usuário'}
                  </Text>
               </View>
            )}
            {conversation.groupConversation === 'true' ? (
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                  <Text style={{ fontSize: hp(2), color: '#FFFFFF' }}>
                     Total de Membros: {users.length}
                  </Text>
               </View>
            ) : (
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Text style={{ fontSize: hp(2), color: '#FFFFFF' }}>
                     Email: {conversation.email || 'Sem Email'}
                  </Text>
               </View>
            )}
         </View>

         {conversation.groupConversation === 'true' && (
            <View className="mx-4">
               <FlatList
                  data={users}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item, index }) =>
                     <MembersList
                        noBorder={index + 1 === users.length}
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