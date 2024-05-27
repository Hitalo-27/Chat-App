import React, {useEffect, useState} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useAuth } from '../context/authContext';

export default function ChatRoomHeader({ router, user }) {
  user = user.user;
  const [imageUri, setImageUri] = useState(`https://drive.google.com/uc?id=${user ? user.imageName ? JSON.parse(user.imageName).id : '' : ''}`);
  const fallbackImageUri = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  const { setMessages } = useAuth();

  const handleImageError = () => {
    setImageUri(fallbackImageUri);
  };

  const backChats = () => {
    setMessages([]);
    router.back();
  }

  useEffect(() => {
    if (user) {
      setImageUri(`https://drive.google.com/uc?id=${user.imageName ? JSON.parse(user.imageName).id : ''}`);
    }
  }, [user]);

  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-4" >
            <TouchableOpacity onPress={backChats}>
              <Entypo name="chevron-left" size={hp(4)} color="#e3e3e3" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-3" onPress={() => router.push({pathname: 'chatProfile', params: { user: JSON.stringify(user) }})}>
              <Image
                source={{ uri: imageUri }}
                style={{ height: hp(4, 5), aspectRatio: 1, borderRadius: 100 }}
                onError={handleImageError}
              />
              <Text style={{ fontSize: hp(2.5) }} className="font-medium text-neutral-100">
                {user?.name || 'Usuário'}
              </Text>
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4">
            {/* <Ionicons name="call" size={hp(2.8)} color="#e3e3e3" />
            <Ionicons name="videocam" size={hp(2.8)} color="#e3e3e3" /> */}
          </View>
        ),
      }}
    />
  );
}