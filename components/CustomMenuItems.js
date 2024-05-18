import { MenuOption } from "react-native-popup-menu";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text, View } from "react-native";

export const MenuItem = ({ text, action, value, icon, color}) => {
  return (
    <MenuOption onSelect={() => action(value)} >
      <View className="px-4 py-1 flex-row justify-between items-center">
        <Text style={{ fontSize: hp(1.7), color: color ? color : '#e3e3e3'}} className="font-semibold">
          {text}
        </Text>
        {icon}
      </View>
    </MenuOption>
  );
}