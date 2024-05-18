import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { AntDesign } from '@expo/vector-icons';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { MenuItem } from "./CustomMenuItems";
import axios from 'axios';

export default function MembersList({ item, router, noBorder, conversationId }) {
  const { user } = useAuth();

  const [imageUri, setImageUri] = useState(`http://192.168.15.8:8080/${item ? item.userImageName : ''}`);
  const fallbackImageUri = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const handleImageError = () => {
    setImageUri(fallbackImageUri);
  };

  const handleExcluir = async () => {
    try {

      console.log(conversationId);

      const response = await axios.delete(
        `http://192.168.15.8:8080/group/${conversationId}/remove/${item.userId}`,
        {
          headers: {
            'Authorization': `Bearer Authorization ${user.token}`
          }
        }
      );

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Sucesso!',
        textBody: 'Usuário removido com sucesso!',
        button: 'Ok',
      });

    }
    catch (error) {
      console.log(error.response.data);

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro!',
        textBody: 'Erro ao remover usuário!',
        button: 'Ok',
      });
    }
  };

  return (
    <Menu>
      <MenuTrigger customStyles={{
        triggerWrapper: {
          flexDirection: 'row',
          justifyContent: 'between',
          alignItems: 'center',
          gap: 10,
          marginBotton: 10,
          paddingBottom: 5,
          paddingTop: 10,
          marginHorizontal: 4,
          borderBottomWidth: 1,
          borderBottomColor: noBorder ? 'transparent' : '#2c2c2c',
        }
      }}>
        <Image
          source={{ uri: imageUri }}
          style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
          onError={handleImageError}
        />

        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-50">{item.name ? item.name : "Usuário"}</Text>
          </View>
          <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-300">{item.lastMessage ? item.lastMessage : item.email}</Text>
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 10,
            borderCurve: 'continuous',
            marginTop: 40,
            marginLeft: 10,
            backgroundColor: 'white',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 0 },
            width: 160,
            backgroundColor: '#1e1e1e',
          }
        }}
      >
        <MenuItem
          text="Excluir"
          action={handleExcluir}
          value={null}
          icon={<AntDesign name="delete" size={24} color="red" />}
          color="red"
        />
      </MenuOptions>
    </Menu>
  );
}