import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { Entypo, Ionicons, Octicons, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import { decodeToken } from "react-jwt";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

export default function Profile() {
   const { user, setUser } = useAuth();
   const [image, setImage] = useState(null);
   const [imageCompleted, setImageCompleted] = useState(null);
   const [name, setName] = useState(user.name);
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const [imageUri, setImageUri] = useState(`http://192.168.15.9:8080/${user ? user.imageName : ''}`);
   const fallbackImageUri = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

   const handleImageError = () => {
      setImageUri(fallbackImageUri);
   };

   const handleUpdateUser = async () => {
      try {
         const formData = new FormData();
         formData.append('name', name);
         formData.append('password', password);
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
               formData.append('image', {
                  uri: uri,
                  name: 'image.jpg',
                  type: 'image/jpeg',
               });
            }
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

         const newUser = decodeToken(response.data.message);
         newUser.token = response.data.message;
         setUser(newUser);

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

   useEffect(() => {
      setName(user.name);
      setImageUri(`http://192.168.15.9:8080/${user.imageName}`);
   }, [user]);

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
                     source={image ? { uri: image } : { uri: imageUri }}
                     style={{ height: hp(20), width: hp(20), borderRadius: 100, marginTop: hp(10) }}
                     onError={handleImageError}
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
         <AlertNotificationRoot colors={[{
            label: 'white',
            card: '#121212',
            overlay: 'white',
            success: '#581c87',
            danger: 'red',
            warning: 'yellow',
         }]} />
      </CustomKeyboardView>
   );
}