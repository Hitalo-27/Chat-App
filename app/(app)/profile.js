import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Button } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { Entypo, Ionicons, Octicons, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import { decodeToken } from 'react-jwt';
import axios from 'axios';

export default function Profile() {
   const { user } = useAuth();
   const [image, setImage] = useState(null);
   const [imageCompleted, setImageCompleted] = useState(null);
   const [name, setName] = useState(user.name);
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const handleUpdateUser = async () => {
      try {
         const formData = new FormData();
         formData.append('name', name);
         formData.append('password', password);
         if (imageCompleted) {
            console.log(imageCompleted);
            formData.append('image', {
               uri: imageCompleted.uri,
               name: 'image.jpg', // Nome do arquivo deve ser fornecido, você pode ajustar conforme necessário
               type: 'image/jpeg', // Tipo do arquivo, você pode ajustar conforme necessário
            });
         }

         const response = await axios.put(
            `http://192.168.15.9:8080/user/update`,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer Authorization ${user.token}`
               }
            }
         );

         console.log(response.data);

      } catch (error) {
         console.log(error);
      }
   };

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

   return (
      <CustomKeyboardView>
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
                           Perfil
                        </Text>
                     </View>
                  </View>
               ),
            }}
         />
         <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
            <View className="items-center">
               <TouchableOpacity onPress={pickImage}>
                  <Image
                     source={image ? { uri: image } : require('../../assets/images/default.png')}
                     style={{ height: hp(20), width: hp(20), borderRadius: 100, marginTop: hp(10) }}
                  />
                  <View style={{ position: 'absolute', bottom: 0, right: 0, padding: 10, borderRadius: 100 }} className="bg-purple-900">
                     <Feather name="camera" size={24} color="white" />
                  </View>
               </TouchableOpacity>
            </View>

            <View className="gap-10">
               {/* inputs */}
               <View className="gap-4">
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Feather name="user" size={hp(2.7)} color="gray" />
                     <TextInput
                        value={name}
                        onChangeText={setName}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Username"
                        placeholderTextColor={'gray'}
                     />
                  </View>
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Octicons name="lock" size={hp(2.7)} color="gray" />
                     <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Nova Senha"
                        secureTextEntry
                        placeholderTextColor={'gray'}
                     />
                  </View>

                  {/* botão de login */}
                  <View>
                     {
                        loading ? (
                           <View className="flex-row justify-center">
                              <Loading size={hp(6.5)} />
                           </View>

                        ) : (
                           <TouchableOpacity onPress={handleUpdateUser} style={{ height: hp(6.5) }} className="bg-purple-900 rounded-xl justify-center items-center">
                              <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider text-center bg-primary-500 rounded--2xl py-2 px-4">
                                 Atualizar Dados
                              </Text>
                           </TouchableOpacity>
                        )

                     }
                  </View>
               </View>
            </View>
         </View>
      </CustomKeyboardView>
   );
}