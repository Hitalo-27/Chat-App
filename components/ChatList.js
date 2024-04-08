import React from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from './ChatItem';

export default function ChatList({ users }) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25, backgroundColor: '#121212'}}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => <ChatItem
          noBorder={index + 1 == users.length}
          router={router}
          item={item}
          index={index}
        />}
      />
    </View>
  );
}