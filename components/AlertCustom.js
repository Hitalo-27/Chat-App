import React from 'react';
import AlertPro from 'react-native-alert-pro';

export default function AlertCustom({ title, message }) {
  return (
    <AlertPro
      ref={ref => {
        this.AlertPro = ref;
      }}
      onConfirm={() => this.AlertPro.close()}
      title={title}
      message={message}
      textConfirm="Ok"
      showCancel={false}
      customStyles={{
        title: {
          fontSize: 20,
          color: "#e3e3e3",
        },
        message: {
          fontSize: 16,
          color: "#e3e3e3",
        },
        container: {
          backgroundColor: "#1e1e1e"
        },
        buttonConfirm: {
          backgroundColor: "#4c1d95"
        }
      }}
    />
  );
};