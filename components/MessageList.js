import React, { useState, useRef, useEffect } from 'react';
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
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [isSliding, setIsSliding] = useState(false);
  const [showControls, setShowControls] = useState(false);

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

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (!isSliding) {
      setSliderValue(status.positionMillis);
    }
    if (status.durationMillis) {
      setDuration(status.durationMillis);
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {messages ? (
          messages.map((message, index) => (
            <MessageItem key={index} message={message} currentUser={currentUser} toggleFullScreen={toggleFullScreen} />
          ))
        ) : null}
      </ScrollView>

      <Modal visible={showFullScreen} transparent={true} onRequestClose={onClose}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close-thick" size={30} color="white" />
          </TouchableOpacity>
          {imageModal.includes('.jpg') || imageModal.includes('.png') ? (
            <ImageZoom
              cropWidth={Dimensions.get('window').width}
              cropHeight={Dimensions.get('window').height}
              imageWidth={Dimensions.get('window').width}
              imageHeight={Dimensions.get('window').height}
            >
              <Image source={{ uri: imageModal }} style={styles.image} resizeMode="contain" />
            </ImageZoom>
          ) : (
            <TouchableOpacity style={styles.videoWrapper} onPress={toggleControls}>
              <Video
                ref={videoRef}
                source={{ uri: "https://sv2.arquivots.fans/Animes/D/dragon-ball-dublado/01.MP4" }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay
                isLooping
                style={styles.video}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />
              {showControls && (
                <View style={styles.controlsContainer}>
                  <View style={styles.controls}>
                    <TouchableOpacity onPress={() => seekTo(Math.max(sliderValue - 10000, 0))}>
                      <MaterialCommunityIcons name="rewind-10" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayPause}>
                      <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => {
                      const status = await videoRef.current.getStatusAsync();
                      seekTo(Math.min(sliderValue + 10000, status.durationMillis));
                    }}>
                      <MaterialCommunityIcons name="fast-forward-10" size={40} color="white" />
                    </TouchableOpacity>
                  </View>
                  <Slider
                    style={{ width: '80%', marginTop: 10 }}
                    minimumValue={0}
                    maximumValue={duration}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#FFFFFF"
                    value={sliderValue}
                    onValueChange={onSliderValueChange}
                    onSlidingStart={onSlidingStart}
                    onSlidingComplete={onSlidingComplete}
                  />
                  <Text style={styles.duration}>
                    {formatTime(sliderValue)} / {formatTime(duration)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
  videoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    width: '70%',
  },
  duration: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});