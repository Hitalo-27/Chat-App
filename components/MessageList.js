import React, { useState } from 'react';
import { ScrollView, Modal, Image, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';
import ImageZoom from 'react-native-image-pan-zoom';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MessageList({ scrollViewRef, messages, currentUser }) {

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [imageModal, setImageModal] = useState('');
  const [messageModal, setMessageModal] = useState('');

  function toggleFullScreen(imageModal, messageModal) {
    setShowFullScreen(!showFullScreen);
    setImageModal(imageModal);
    setMessageModal(messageModal);
  }
''
  const onClose = () => {
    setShowFullScreen(false);
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {
          messages ? (
            messages.map((message, index) => {
              return (
                <MessageItem key={index} message={message} currentUser={currentUser} toggleFullScreen={toggleFullScreen} />
              )
            })
          ) : null
        }
      </ScrollView>

      <Modal visible={showFullScreen} transparent={true} onRequestClose={onClose}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close-thick" size={30} color="white" />
          </TouchableOpacity>
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height}
          >
            <Image
              source={{ uri: imageModal }}
              style={styles.image}
              resizeMode='contain'
            />
          </ImageZoom>
          <Text style={styles.messageModal}>{messageModal}</Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  messageModal: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
  },
});