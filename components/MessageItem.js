import React from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MessageItem({ message, currentUser }) {
  if (currentUser?.userId === message?.senderId) { 
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
  } else {
    return (
      <View style={{ width: wp(80) }} className="ml-3 mb-3">
        <View className="flex self-start p-3 rounded-2xl bg-indigo-400 border border-indigo-500">
          <Text style={{ fontSize: hp(1.9) }}>
            {message.message}
          </Text>
        </View>
      </View >
    );
  }
}