import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChatItem({ item, router, noBorder }) {
  const { user } = useAuth();

  var id = item.id;
  var name = item.name;

  if (!id) {
    if(!user) return;
    if(user.id === item.senderId){
      id = item.userIdByRecipientId;
      name = item.recipientName;
    } else {
      id = item.senderId;
      name = item.senderName;
    }
  }

  const openChatRoom = () => {
    router.push({
      pathname: 'chatRoom',
      params: {
        id: id,
        name: name,
        idConversation: item.conversationId ? item.conversationId : null,
        idLastMessage: item.chatId,
        visualizeLastMessage : item.visualize,
        senderIdLastMessage: item.senderId,
      }
    });
  }

  return (
    <TouchableOpacity onPress={openChatRoom} className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder ? '' : 'border-b border-neutral-600'}`}>
      <Image
        source={require('../assets/images/default.png')}
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
      />

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-50">{name ? name : "Usuário"}</Text>
          {!item.visualize && item.senderId !== user.id ? (
            <View className="flex-row items-center">
              <MaterialIcons name="notifications-on" size={24} color="#e3e3e3" />
            </View>
          ) : null}
        </View>
        <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-300">{item.lastMessage ? item.lastMessage : item.email}</Text>
      </View>

    </TouchableOpacity>
  );
}