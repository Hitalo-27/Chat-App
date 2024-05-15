import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MessageItem({ message, currentUser, toggleFullScreen }) {
  const [imageUri, setImageUri] = useState(`http://192.168.15.9:8080/images/${message.imageName}`);
  const fallbackImageUri = 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=';
  
  const handleImageError = () => {
    setImageUri(fallbackImageUri);
  };

  if (currentUser?.userId === message?.senderId) {
    if (message.imageName) {
      return (
        <TouchableOpacity onPress={() => toggleFullScreen(imageUri, message.message)} className="flex-row justify-end mb-3 mr-3">
          <View style={{ width: wp(80) }}>
            <View className="flex self-end p-2 rounded-2xl border border-neutral-800" style={{ backgroundColor: "#1e1e1e" }}>
              <Image
                source={{ uri:  imageUri }}
                style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                className="rounded-lg"
                onError={handleImageError}
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
        <TouchableOpacity onPress={() => toggleFullScreen(imageUri, message.message)} className="flex-row mb-3 ml-3">
          <View style={{ width: wp(80) }}>
            <View className="flex self-start p-2 rounded-2xl bg-purple-800 border border-purple-900">
              <Image
                source={{ uri:  imageUri }}
                style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                className="rounded-lg"
                onError={handleImageError}
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