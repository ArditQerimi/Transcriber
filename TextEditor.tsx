import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Button,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { pick } from '@react-native-documents/picker';
import SoundPlayer from 'react-native-sound-player';

const Basic = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressBarRef = useRef(null);

  // Function to pause the currently playing audio
  const pauseAudio = () => {
    try {
      SoundPlayer.pause();
      console.log('Audio paused');
      setIsPlaying(false);
      SoundPlayer.getInfo().then(info => {
        setCurrentTime(info.currentTime);
      }).catch(err => {
        console.error('Error getting audio info:', err);
      });
    } catch (e) {
      console.error('Cannot pause the audio', e);
    }
  };

  // Function to stop the currently playing audio
  const stopAudio = () => {
    try {
      SoundPlayer.stop();
      console.log('Audio stopped');
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (e) {
      console.error('Cannot stop the audio', e);
    }
  };

  // Function to handle file picking and playing
  const pickAndPlayAudio = async () => {
    console.log('Button pressed to pick a file');
    try {
      console.log('Attempting to pick a file...');
      const [pickResult] = await pick();
      console.log('File picked successfully:', pickResult);

      if (pickResult.uri) {
        try {
          SoundPlayer.playUrl(pickResult.uri);
          console.log('Playing picked audio file');
          setIsPlaying(true);
          SoundPlayer.getInfo().then(info => {
            setDuration(info.duration);
            setCurrentTime(info.currentTime);
          }).catch(err => {
            console.error('Error getting audio info:', err);
          });
        } catch (e) {
          console.error('Cannot play the picked audio file', e);
        }
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  // Effect to handle audio loading
  useEffect(() => {
    const onFinishedLoading = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
      if (success) {
        console.log('Audio file loaded successfully');
        SoundPlayer.getInfo().then(info => {
          setDuration(info.duration);
          setCurrentTime(info.currentTime);
        }).catch(err => {
          console.error('Error getting audio info:', err);
        });
      }
    });

    return () => {
      onFinishedLoading.remove();
    };
  }, []);

  // Effect to update currentTime during playback
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        SoundPlayer.getInfo().then(info => {
          setCurrentTime(info.currentTime);
          if (info.currentTime >= info.duration) {
            setIsPlaying(false);
            setCurrentTime(0);
            SoundPlayer.stop();
          }
        }).catch(err => {
          console.error('Error getting audio info:', err);
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle seeking when the progress bar is pressed
  const handleProgressBarPress = (event) => {
    if (duration <= 0) return;

    // Get the x-coordinate of the touch relative to the progress bar
    progressBarRef.current.measure((fx, fy, width, height, px, py) => {
      const touchX = event.nativeEvent.pageX - px;
      const newTime = (touchX / width) * duration;

      // Ensure newTime is within valid bounds
      if (newTime >= 0 && newTime <= duration) {
        try {
          SoundPlayer.seek(newTime);
          setCurrentTime(newTime);
          if (!isPlaying) {
            SoundPlayer.play();
            setIsPlaying(true);
          }
        } catch (e) {
          console.error('Error seeking audio:', e);
        }
      }
    });
  };

  // PanResponder for drag support
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (duration <= 0) return;

        progressBarRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = evt.nativeEvent.pageX - px;
          const newTime = (touchX / width) * duration;

          if (newTime >= 0 && newTime <= duration) {
            try {
              SoundPlayer.seek(newTime);
              setCurrentTime(newTime);
              if (!isPlaying) {
                SoundPlayer.play();
                setIsPlaying(true);
              }
            } catch (e) {
              console.error('Error seeking audio during drag:', e);
            }
          }
        });
      },
    })
  ).current;

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format time for display (MM:SS)
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Audio Player Controls</Text>
      <View style={styles.buttonContainer}>
        <Button title="Pick and Play Audio File" onPress={pickAndPlayAudio} />
        <Button title="Pause Audio" onPress={pauseAudio} />
        <Button title="Stop Audio" onPress={stopAudio} />
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
        <TouchableWithoutFeedback onPress={handleProgressBarPress}>
          <View
            ref={progressBarRef}
            style={styles.progressBar}
            {...panResponder.panHandlers}
          >
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  timeText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default Basic;