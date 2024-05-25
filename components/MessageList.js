import React, { useState, useRef } from 'react';
import { ScrollView, Modal, Image, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';
import ImageZoom from 'react-native-image-pan-zoom';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function MessageList({ scrollViewRef, messages, currentUser }) {

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [imageModal, setImageModal] = useState('');
  const [messageModal, setMessageModal] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [sliderValue, setSliderValue] = useState(0);
  const videoRef = useRef(null);
  const [isSliding, setIsSliding] = useState(false); // Para evitar atualizações de posição do vídeo enquanto estivermos deslizando o slider

  function toggleFullScreen(imageModal, messageModal) {
    setShowFullScreen(!showFullScreen);
    setImageModal(imageModal);
    setMessageModal(messageModal);
  }

  const onClose = () => {
    setShowFullScreen(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = async (value) => {
    await videoRef.current.setPositionAsync(value);
  };

  const onSliderValueChange = (value) => {
    setSliderValue(value);
  };

  const onSlidingStart = () => {
    setIsSliding(true);
  };

  const onSlidingComplete = async (value) => {
    setIsSliding(false);
    await seekTo(value);
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds - minutes * 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
          { imageModal.includes('.jpg') || imageModal.includes('.png') ? (
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
          ) : (
            <>
            <Video
              ref={videoRef}
              source={{ uri: "https://sv2.arquivots.fans/Animes/D/dragon-ball-dublado/01.MP4" }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              isLooping
              style={styles.image}
              onPlaybackStatusUpdate={(status) => {
                if (!isSliding) { // Atualizar o slider apenas se não estivermos deslizando
                  setSliderValue(status.positionMillis);
                }
              }}
            />
            <View style={styles.controlsContainer}>
              <View style={styles.controls}>
                <TouchableOpacity onPress={() => seekTo(Math.max(sliderValue - 10000, 0))}>
                  <MaterialCommunityIcons name="rewind-10" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                  <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => seekTo(Math.min(sliderValue + 10000, videoRef.current ? videoRef.current.getStatusAsync().durationMillis : 0))}>
                  <MaterialCommunityIcons name="fast-forward-10" size={30} color="white" />
                </TouchableOpacity>
              </View>
              <Slider
                style={{ width: '80%', marginTop: 10 }}
                minimumValue={0}
                maximumValue={videoRef.current ? videoRef.current.getStatusAsync().durationMillis : 0}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FFFFFF"
                value={sliderValue}
                onValueChange={onSliderValueChange}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSlidingComplete}
              />
              <Text style={styles.duration}>
                {formatTime(sliderValue)} / {formatTime(videoRef.current ? videoRef.current.getStatusAsync().durationMillis : 0)}
              </Text>
            </View>
            </>
          )}
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
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
  },
  duration: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});