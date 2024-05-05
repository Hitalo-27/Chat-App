import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { FontAwesome6, Octicons, Feather } from '@expo/vector-icons';
import Loading from '../../components/Loading';
export default function Profile() {
   const { user } = useAuth();
   const [name, setName] = useState(user.name);
   const [email, setEmail] = useState(user.email);
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const handleUpdateUser = () => {
      // Implementação da função para atualizar os dados do usuário
   };

   return (

      <CustomKeyboardView>
         <StatusBar style="dark" />
         <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
            <View className="items-center">
               <Image
                  source={{ uri: 'https://img.freepik.com/fotos-gratis/respingo-colorido-abstrato-3d-background-generativo-ai-background_60438-2509.jpg' }}
                  style={{ height: hp(20), width: hp(20), borderRadius: 100, marginTop: hp(10) }}
               />
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
                     <Octicons name="mail" size={hp(2.7)} color="gray" />
                     <TextInput
                        value={email}
                        onChangeText={setEmail}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Email"
                        placeholderTextColor={'gray'}
                     />
                  </View>
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Octicons name="lock" size={hp(2.7)} color="gray" />
                     <TextInput
                        value={password}
                        onChangeText={setPassword}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Senha"
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
                                 Update
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