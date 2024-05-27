import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome } from '@expo/vector-icons';
import { Audio, Video } from 'expo-av';

export default function MessageItem({ message, currentUser, toggleFullScreen }) {
  const [imageUri, setImageUri] = useState(`https://drive.google.com/uc?id=${message.imageName ? JSON.parse(message.imageName).id : ''}`);
  const [mediaUri, setMediaUri] = useState(`https://drive.google.com/uc?export=download&id=${message.imageName ? JSON.parse(message.imageName).id : ''}`);
  const [extensao, setExtensao] = useState(message.imageName ? JSON.parse(message.imageName).extensao : '');
  const fallbackImageUri = 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=';
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const soundRef = useRef(null);
  const progressBarRef = useRef(null);

  const handleImageError = () => {
    setImageUri(fallbackImageUri);
  };

  const handleVideoError = (error) => {
    console.error("Erro ao carregar ou reproduzir o vídeo:", error);
  };

  useEffect(() => {
    const loadAudio = async () => {
      if (setMediaUri && extensao === "m4a") {
        try {
          const { sound, status } = await Audio.Sound.createAsync(
            { uri: mediaUri },
            { shouldPlay: false },
            onPlaybackStatusUpdate
          );
          soundRef.current = sound;
          setDuration(status.durationMillis);
        } catch (error) {
          console.error("Error loading audio:", error);
        }
      }
    };

    loadAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [mediaUri]);

  const onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (!status.isPlaying && status.didJustFinish) {
        soundRef.current.setPositionAsync(0);
        setIsPlaying(false);
      }
      if (status.durationMillis) {
        setIsLoadingMedia(false);
      }
    }
  };

  const playSound = async () => {
    if (soundRef.current) {
      if (position >= duration) {
        await soundRef.current.setPositionAsync(0);
      }
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };

  const formatTime = millis => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updateProgress = async () => {
    if (soundRef.current && isPlaying) {
      const status = await soundRef.current.getStatusAsync();
      setPosition(status.positionMillis);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateProgress, 1000);
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const progress = duration ? (position / duration) * 100 : 0;

  const handleProgressBarPress = async (e) => {
    if (soundRef.current && progressBarRef.current) {
      const { locationX } = e.nativeEvent;
      progressBarRef.current.measure((fx, fy, width, height, px, py) => {
        const newPosition = (locationX / width) * duration;
        if (newPosition >= 0 && newPosition <= duration) {
          soundRef.current.setPositionAsync(newPosition);
          setPosition(newPosition);
        }
      });
    }
  };


  if (currentUser?.userId === message?.senderId) {
    if (message.imageName) {
      let arquivo = JSON.parse(message.imageName);
      if (arquivo.extensao === "m4a") {
        return (
          <View style={styles.messageRowRight}>
            <View style={styles.messageBoxRight}>
              <View style={styles.audioContainer}>
                {isLoadingMedia ? (
                  <View style={styles.playButton}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                ) : (
                  <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                    <FontAwesome name={isPlaying ? 'pause' : 'play'} size={24} color="#FFF" />
                  </TouchableOpacity>
                )}
                <View
                  style={styles.progressBarContainer}
                  ref={progressBarRef}
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={handleProgressBarPress}
                >
                  <View style={[styles.progressBar, { width: `${progress}%` }]}></View>
                </View>
                <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        );
      } else if (arquivo.extensao === "jpg") {
        return (
          <View className="flex-row justify-end mb-3 mr-3">
            <TouchableOpacity onPress={() => toggleFullScreen(imageUri, message.message, 'jpg')} style={{ width: wp(70) }}>
              <View className="flex self-end p-2 rounded-2xl border border-neutral-800" style={{ backgroundColor: "#1e1e1e" }}>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                  className="rounded-lg"
                  onError={handleImageError}
                />
                {message.message && (
                  <Text style={{ fontSize: hp(1.9) }} className="text-neutral-100 pt-2">
                    {message.message}
                  </Text>
                )}
              </View>
            </TouchableOpacity >
          </View>
        );
      } else if (arquivo.extensao === "mp4") {
        return (
          <View className="flex-row justify-end mb-3 mr-3">
            <TouchableOpacity onPress={() => toggleFullScreen(mediaUri, message.message, 'mp4')}>
              <View className="relative p-2 rounded-2xl border border-neutral-800" style={{ backgroundColor: "#1e1e1e" }}>
                {isLoadingMedia && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                )}
                <Video
                  source={{ uri: mediaUri }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  resizeMode="cover"
                  isLooping
                  style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                  onError={handleVideoError}
                />
                <View style={{ position: 'absolute', top: '45%', left: '50%', transform: [{ translateX: -12 }, { translateY: -12 }] }} >
                  <FontAwesome name="play" size={50} color="#FFF" />
                </View>
                {message.message && (
                  <Text style={{ fontSize: hp(1.9) }} className="text-neutral-100 pt-2">
                    {message.message}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    }
    else {
      return (
        <View className="flex-row justify-end mb-3 mr-3">
          <View style={{ width: wp(70) }}>
            <View className="flex self-end p-3 rounded-2xl border border-neutral-800" style={{ backgroundColor: "#1e1e1e" }}>
              <Text style={{ fontSize: hp(1.9) }} className="text-neutral-100">
                {message.message}
              </Text>
            </View>
          </View>
        </View >
      );
    }
  } else {
    if (message.imageName) {
      let arquivo = JSON.parse(message.imageName);
      if (arquivo.extensao === "m4a") {
        return (
          <View style={styles.messageRowLeft}>
            <View style={styles.messageBoxLeft}>
              {message.senderName && (
                <Text style={{ fontSize: hp(1.2) }} className="text-blue-500 pb-2"> ~{message.senderName} </Text>
              )}
              <View style={styles.audioContainer}>

                {isLoadingMedia ? (
                  <View style={styles.playButton}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                ) : (
                  <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                    <FontAwesome name={isPlaying ? 'pause' : 'play'} size={24} color="#FFF" />
                  </TouchableOpacity>
                )}
                <View
                  style={styles.progressBarContainerLeft}
                  ref={progressBarRef}
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={handleProgressBarPress}
                >
                  <View style={[styles.progressBar, { width: `${progress}%` }]}></View>
                </View>
                <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        );
      } else if (arquivo.extensao === "jpg") {
        return (
          <View className="flex-row mb-3 ml-3">
            <TouchableOpacity onPress={() => toggleFullScreen(imageUri, message.message, 'jpg')} style={{ width: wp(70) }}>
              <View className="flex self-start p-2 rounded-2xl border border-purple-900" style={{ backgroundColor: "#581c87" }}>
                {message.senderName && (
                  <Text style={{ fontSize: hp(1.2) }} className="text-blue-500 pb-2"> ~{message.senderName} </Text>
                )}
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                  className="rounded-lg"
                  onError={handleImageError}
                />
                {message.message && (
                  <Text style={{ fontSize: hp(1.9) }} className="text-white">
                    {message.message}
                  </Text>
                )}
              </View>
            </TouchableOpacity >
          </View>
        );
      } else if (arquivo.extensao === "mp4") {
        return (
          <View className="flex-row mb-3 ml-3" >
            <TouchableOpacity onPress={() => toggleFullScreen(mediaUri, message.message, 'mp4')} style={{ width: wp(70) }}>
              <View className="relative self-start p-2 rounded-2xl border border-purple-900" style={{ backgroundColor: "#581c87" }}>
                {message.senderName && (
                  <Text style={{ fontSize: hp(1.2) }} className="text-blue-500 pb-2"> ~{message.senderName} </Text>
                )}
                {isLoadingMedia && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                )}
                <Video
                  source={{ uri: mediaUri }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={{ width: wp(60), height: hp(20), borderRadius: 10 }}
                  onError={handleVideoError}
                />
                <View style={{ position: 'absolute', top: '45%', left: '50%', transform: [{ translateX: -12 }, { translateY: -12 }] }} >
                  <FontAwesome name="play" size={50} color="#FFF" />
                </View>
                <Text style={{ fontSize: hp(1.9) }} className="text-white">
                  {message.message}
                </Text>
              </View>
            </TouchableOpacity >
          </View>
        );
      }
    } else {
      return (
        <View style={{ width: wp(70) }} className="ml-3 mb-3">
          <View className="flex self-start p-3 rounded-2xl border border-purple-900" style={{ backgroundColor: "#581c87" }}>
            {message.senderName && (
              <Text style={{ fontSize: hp(1.2) }} className="text-blue-500"> ~{message.senderName} </Text>
            )}
            <Text style={{ fontSize: hp(1.9) }} className="text-white">
              {message.message}
            </Text>
          </View>
        </View >
      );
    }
  }
}

const styles = StyleSheet.create({
  messageRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: hp('1.5%'),
    marginRight: wp('3%'),
  },
  messageBoxRight: {
    width: wp('60%'),
    padding: hp('2%'),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginRight: wp('2%'),
  },
  progressBarContainer: {
    flex: 1,
    height: hp('2%'),
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  timeText: {
    marginLeft: wp('2%'),
    fontSize: hp('1.3%'),
    color: '#FFF',
  },
  messageRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp('1.5%'),
    marginLeft: wp('3%'),
  },
  messageBoxLeft: {
    width: wp('60%'),
    padding: hp('2%'),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#581c87',
    backgroundColor: '#581c87',
  },
  progressBarContainerLeft: {
    flex: 1,
    height: hp('2%'),
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingRight: wp('3%'),
  },
});