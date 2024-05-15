import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView} from "react-native";

const ios = Platform.OS == "ios";
export default function CustomKeyboardView({ children, inChat }) {
  let kavConfig = {};
  let scrollViewConfig = {};
  if(inChat){
    kavConfig = {keyboardVerticalOffset: 90},
    scrollViewConfig = {contentContainerStyle: { flex: 1 }}
  }
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#121212"}}
      {...kavConfig}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        {...scrollViewConfig}
      >
        {
          children
        }
      </ScrollView>
    </KeyboardAvoidingView>

  );
}