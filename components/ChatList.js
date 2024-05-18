import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import ChatItem from './ChatItem';
import { Entypo } from '@expo/vector-icons';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

export default function ChatList({ users, isConversation = true, isGroup = false }) {
  const router = useRouter();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectUser = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter(u => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    if (!selectedUsers.length) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro',
        textBody: "Selecione pelo menos um usuário para criar um grupo.",
        button: 'Ok',
      });
      return;
    }

    router.push({
      pathname: 'createGroup',
      params: {
        selectedUsers: JSON.stringify(selectedUsers),
      }
    });
  };

  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25, backgroundColor: '#121212' }}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) =>
          <ChatItem
            noBorder={index + 1 == users.length}
            router={router}
            item={item}
            index={index}
            onSelect={handleSelectUser}
            isSelected={selectedUsers.includes(item)}
            isGroup={isGroup}
            isConversation={isConversation}
          />
        }
      />

      {
        isConversation === true ? (
          <TouchableOpacity onPress={() => router.push('/contacts')} className="absolute right-0 bottom-0 mr-4 mb-4 bg-purple-900" style={{ width: wp(15), height: wp(15), borderRadius: wp(15) / 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-white">+</Text>
          </TouchableOpacity>
        ) : null
      }

      {
        isGroup === true ? (
          <>
            <TouchableOpacity onPress={handleCreateGroup} className="absolute right-0 bottom-0 mr-4 mb-4 bg-purple-900" style={{ width: wp(15), height: wp(15), borderRadius: wp(15) / 2, justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <View>
              <AlertNotificationRoot colors={[{
                label: 'white',
                card: '#121212',
                overlay: 'white',
                success: '#581c87',
                danger: 'red',
                warning: 'yellow',
              }]} />
            </View>
          </>
        ) : null
      }
    </View>
  );
}