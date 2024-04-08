import { View, Image, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6, Octicons, Feather } from '@expo/vector-icons';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import Loading from '../components/Loading';
import { useRouter } from 'expo-router';
import AlertCustom from '../components/AlertCustom';

export default function SignUp() {
   const router = useRouter();
   const emailRef = useRef("");
   const passwordRef = useRef("");
   const usernameRef = useRef("");
   const profileRef = useRef("");
   const [loading, setLoading] = useState(false);
   const { register } = useAuth();

   const handleRegister = async () => {
      if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
         this.AlertPro.open()
         return;
      }

      setLoading(true);
      const response = await register();
      // setLoading(false);
   }

   return (
      <CustomKeyboardView>
         <StatusBar style="dark" />
         <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
            <View className="items-center">
               <FontAwesome6 name="user-lock" size={150} color="#4c1d95" />
            </View>


            <View className="gap-10">
               <Text style={{ fontSize: hp(4), color: "#e3e3e3" }} className="font-bold tracking-wider text-center text-neutral-800">Cadastre-se</Text>

               {/* inputs */}
               <View className="gap-4">
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Feather name="user" size={hp(2.7)} color="gray" />
                     <TextInput
                        onChangeText={value => usernameRef.current = value}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Username"
                        placeholderTextColor={'gray'}
                     />
                  </View>
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Feather name="image" size={hp(2.7)} color="gray" />
                     <TextInput
                        onChangeText={value => emailRef.current = value}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Profile url"
                        placeholderTextColor={'gray'}
                     />
                  </View>
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Octicons name="mail" size={hp(2.7)} color="gray" />
                     <TextInput
                        onChangeText={value => emailRef.current = value}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-300"
                        placeholder="Email"
                        placeholderTextColor={'gray'}
                     />
                  </View>
                  <View style={{ height: hp(7), backgroundColor: "#1e1e1e" }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded--2xl">
                     <Octicons name="lock" size={hp(2.7)} color="gray" />
                     <TextInput
                        onChangeText={value => passwordRef.current = value}
                        style={{ fontSize: hp(2) }}
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
                           <TouchableOpacity onPress={handleRegister} style={{ height: hp(6.5) }} className="bg-purple-900 rounded-xl justify-center items-center">
                              <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider text-center bg-primary-500 rounded--2xl py-2 px-4">
                                 Cadastre-se
                              </Text>
                           </TouchableOpacity>
                        )

                     }
                  </View>

                  <View className="flex-row justify-center">
                     <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Já tem uma conta? </Text>
                     <Pressable onPress={() => router.push('/signIn')}>
                        <Text style={{ fontSize: hp(1.8) }} className="font-bold text-violet-500">Login</Text>
                     </Pressable>
                  </View>
               </View>
            </View>
         </View>
         <AlertCustom title="Cadastro" message="Preencha todos os campos!" />
      </CustomKeyboardView>
   );
}