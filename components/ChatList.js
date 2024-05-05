import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import ChatItem from './ChatItem';

export default function ChatList({ users, isConversation = true }) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25, backgroundColor: '#121212' }}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => <ChatItem
          noBorder={index + 1 == users.length}
          router={router}
          item={item}
          index={index}
        />}
      />

      {
        isConversation === true ? (
          <TouchableOpacity onPress={() => router.push('/contacts')} className="absolute right-0 bottom-0 mr-4 mb-4 bg-purple-900" style={{ width: wp(15), height: wp(15), borderRadius: wp(15) / 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-white">+</Text>
          </TouchableOpacity>
        ) : null
      }
    </View>
  );
}