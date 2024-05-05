import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ChatItem({ item, router, noBorder }) {

  const openChatRoom = () => {
    router.push({
      pathname: 'chatRoom',
      params: {
        id: item.id,
        name: item.name
      }
    });
  }

  return (
    <TouchableOpacity onPress={openChatRoom} className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder ? '' : 'border-b border-neutral-600'}`}>
      <Image
        source="https://img.freepik.com/fotos-gratis/respingo-colorido-abstrato-3d-background-generativo-ai-background_60438-2509.jpg"
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
      />

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-50">{item.name}</Text>
        </View>
        <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-300">{item.lastMessage ? item.lastMessage : item.email}</Text>
      </View>

    </TouchableOpacity>
  );
}