import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6, Octicons } from '@expo/vector-icons';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import Loading from '../components/Loading';
import { useRouter } from 'expo-router';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

export default function SignIn() {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        try{
            if (!emailRef.current || !passwordRef.current) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Erro!',
                    textBody: "Preencha todos os campos!",
                    button: 'Ok',
                });
                return;
            }
    
            setLoading(true);
            const response = await login(emailRef.current, passwordRef.current);
            setLoading(false);
    
            if (response.error === true) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Erro!',
                    textBody: response.message,
                    button: 'Ok',
                });
            }
        }
        catch(err){
            setLoading(false);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Erro!',
                textBody: 'Ocorreu um erro ao tentar fazer login!',
                button: 'Ok',
            });
        }
    }

    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                <View className="items-center">
                    <FontAwesome6 name="user-lock" size={150} color="#581c87" />
                </View>

                <View className="gap-10">
                    <Text style={{ fontSize: hp(4), color: "#e3e3e3" }} className="font-bold tracking-wider text-center text-neutral-800">Bem vindo!</Text>

                    {/* inputs */}
                    <View className="gap-4">
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
                        <View className="gap-3">
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
                        </View>

                        {/* botão de login */}
                        <View>
                            {
                                loading ? (
                                    <View className="flex-row justify-center">
                                        <Loading size={hp(6.5)} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleLogin} style={{ height: hp(6.5) }} className="bg-purple-900 rounded-xl justify-center items-center">
                                        <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider text-center bg-primary-500 rounded--2xl py-2 px-4">Login</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Não tem uma conta? </Text>
                            <Pressable onPress={() => router.push('/signUp')}>
                                <Text style={{ fontSize: hp(1.8) }} className="font-bold text-purple-600">Cadastre-se</Text>
                            </Pressable>
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
