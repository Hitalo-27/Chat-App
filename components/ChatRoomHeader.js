import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';

export default function ChatRoomHeader({router}) {
  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-4" >
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={hp(4)} color="#e3e3e3" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <Image
                source="https://avatars.githubusercontent.com/u/56124084?v=4"
                style={{ height: hp(4, 5), aspectRatio: 1, borderRadius: 100 }}
              />
              <Text style={{ fontSize: hp(2.5) }} className="font-medium text-neutral-100">
                Hitalo
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4">
            <Ionicons name="call" size={hp(2.8)} color="#e3e3e3" />
            <Ionicons name="videocam" size={hp(2.8)} color="#e3e3e3" />
          </View>
        ),
      }}
    />
  );
}