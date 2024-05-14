import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MessageItem({ message, currentUser, toggleFullScreen }) {
  if (currentUser?.userId === message?.senderId) {
    if (message.imageName) {
      return (
        <TouchableOpacity onPress={() => toggleFullScreen("https://img.freepik.com/fotos-gratis/uma-pintura-de-um-lago-de-montanha-com-uma-montanha-ao-fundo_188544-9126.jpg", message.message)} className="flex-row justify-end mb-3 mr-3">
          <View style={{ width: wp(80) }}>
            <View className="flex self-end p-2 rounded-2xl border border-neutral-800" style={{ backgroundColor: "#1e1e1e" }}>
              <Image
                source={{ uri: `https://img.freepik.com/fotos-gratis/uma-pintura-de-um-lago-de-montanha-com-uma-montanha-ao-fundo_188544-9126.jpg` }}
                style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                className="rounded-lg"
              />
              <Text style={{ fontSize: hp(1.9) }} className="text-neutral-100 pt-2">
                {message.message}
              </Text>
            </View>
          </View>
        </TouchableOpacity >
      );
    } else {
      return (
        <View className="flex-row justify-end mb-3 mr-3">
          <View style={{ width: wp(80) }}>
            <View className="flex self-end p-3 rounded-2xl border border-neutral-800" style={{ backgroundColor: "#1e1e1e" }}>
              <Text style={{ fontSize: hp(1.9) }} className="text-neutral-100">
                {message.message}
              </Text>
            </View>
          </View>
        </View >
      );
    }
  } else {
    if (message.imageName) {
      return (
        <TouchableOpacity onPress={() => toggleFullScreen("https://img.freepik.com/fotos-gratis/uma-pintura-de-um-lago-de-montanha-com-uma-montanha-ao-fundo_188544-9126.jpg", message.message)} className="flex-row mb-3 ml-3">
          <View style={{ width: wp(80) }}>
            <View className="flex self-start p-2 rounded-2xl bg-purple-800 border border-purple-900">
              <Image
                source={{ uri: `https://img.freepik.com/fotos-gratis/uma-pintura-de-um-lago-de-montanha-com-uma-montanha-ao-fundo_188544-9126.jpg` }}
                style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                className="rounded-lg"
              />
              <Text style={{ fontSize: hp(1.9) }} className="text-white">
                {message.message}
              </Text>
            </View>
          </View>
        </TouchableOpacity >
      );
    } else {
      return (
        <View style={{ width: wp(80) }} className="ml-3 mb-3">
          <View className="flex self-start p-3 rounded-2xl bg-purple-800 border border-purple-900">
            <Text style={{ fontSize: hp(1.9) }} className="text-white">
              {message.message}
            </Text>
          </View>
        </View >
      );
    }
  }
}