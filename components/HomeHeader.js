import { Platform, Text, View } from "react-native";
import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import {
   Menu,
   MenuOptions,
   MenuTrigger,
} from 'react-native-popup-menu';
import { MenuItem } from "./CustomMenuItems";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useAuth } from "../context/authContext";

const ios = Platform.OS == 'ios';
export default function HomeHeader() {
   const { top } = useSafeAreaInsets();
   const { logout } = useAuth();

   const handleProfile = () => {

   }

   const handleLogout = async () => {
      const response = await logout();
   }

   return (
      <View style={{ paddingTop: ios ? top : top + 10 }} className="flex-row justify-between px-5 bg-violet-900 pb-6 rounded-b-3xl shadow">
         <View>
            <Text style={{ fontSize: hp(3) }} className="font-medium text-white">Conversas</Text>
         </View>

         <View>
            <Menu>
               <MenuTrigger customStyles={{
                  triggerWrapper: {
                     padding: 5,
                     borderRadius: 100,
                     backgroundColor: "rgba(0,0,0,0.1)"
                  }
               }}>
                  <Image
                     style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
                     source="https://avatars.githubusercontent.com/u/56124084?v=4"
                     placeholder={blurhash}
                     transition={500}
                  />
               </MenuTrigger>
               <MenuOptions
                  customStyles={{
                     optionsContainer: {
                        borderRadius: 10,
                        borderCurve: 'continuous',
                        marginTop: 40,
                        marginLeft: -30,
                        backgroundColor: 'white',
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 0 },
                        width: 160,
                        backgroundColor: '#1e1e1e',
                     }
                  }}
               >
                  <MenuItem
                     text="Perfil"
                     action={handleProfile}
                     value={null}
                     icon={<Feather name="user" size={hp(2.5)} color="#e3e3e3" />}
                  />
                  <MenuItem
                     text="Sair"
                     action={handleLogout}
                     value={null}
                     icon={<AntDesign name="logout" size={hp(2.5)} color="#e3e3e3" />}
                  />
               </MenuOptions>
            </Menu>
         </View>
      </View>
   );
}

const Divider = () => {
   return (
      <View className = "p-{1px} w-full bg-neutral-200" />
   );
}