import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { pick } from '@react-native-documents/picker';
import SoundPlayer from 'react-native-sound-player';
import QuillEditor from './components/QuillEditor';

const Basic = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progressBarRef = useRef(null);
  const [editorContent, setEditorContent] = useState(
    '<h1>Initial Content from Parent</h1><p>Start editing here...</p>'
  );

  const handleEditorChange = (html) => {
    setEditorContent(html);
    console.log('Editor content:', html);
  };

  const pauseAudio = () => {
    try {
      SoundPlayer.pause();
      setIsPlaying(false);
      SoundPlayer.getInfo()
        .then((info) => {
          setCurrentTime(info.currentTime);
        })
        .catch((err) => {
          console.error('Error getting audio info:', err);
        });
    } catch (e) {
      console.error('Cannot pause the audio', e);
    }
  };

  const stopAudio = () => {
    try {
      SoundPlayer.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (e) {
      console.error('Cannot stop the audio', e);
    }
  };

  const pickAndPlayAudio = async () => {
    try {
      const [pickResult] = await pick();
      if (pickResult.uri) {
        SoundPlayer.playUrl(pickResult.uri);
        setIsPlaying(true);
        SoundPlayer.getInfo()
          .then((info) => {
            setDuration(info.duration);
            setCurrentTime(info.currentTime);
          })
          .catch((err) => {
            console.error('Error getting audio info:', err);
          });
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  const seekBackward = () => {
    const newTime = Math.max(0, currentTime - 3);
    try {
      SoundPlayer.seek(newTime);
      setCurrentTime(newTime);
      if (!isPlaying) {
        SoundPlayer.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Error seeking backward:', e);
    }
  };

  const seekForward = () => {
    const newTime = Math.min(duration, currentTime + 3);
    try {
      SoundPlayer.seek(newTime);
      setCurrentTime(newTime);
      if (!isPlaying) {
        SoundPlayer.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Error seeking forward:', e);
    }
  };

  useEffect(() => {
    progressBarRef.current.measure((fx, fy, width, height, px, py) => {
      setProgressBarWidth(width);
    });
  }, []);

  useEffect(() => {
    const onFinishedLoading = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
      if (success) {
        SoundPlayer.getInfo()
          .then((info) => {
            setDuration(info.duration);
            setCurrentTime(info.currentTime);
          })
          .catch((err) => {
            console.error('Error getting audio info:', err);
          });
      }
    });
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        SoundPlayer.getInfo()
          .then((info) => {
            setCurrentTime(info.currentTime);
            if (info.currentTime >= info.duration) {
              setIsPlaying(false);
              setCurrentTime(0);
              SoundPlayer.stop();
            }
          })
          .catch((err) => {
            console.error('Error getting audio info:', err);
          });
      }, 200);
    }
    return () => {
      onFinishedLoading.remove();
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleProgressBarPress = (event) => {
    if (duration <= 0 || progressBarWidth <= 0) return;

    const touchX = Math.max(0, Math.min(event.nativeEvent.locationX, progressBarWidth));
    const newTime = (touchX / progressBarWidth) * duration;

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
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (isPlaying) {
          SoundPlayer.pause();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (duration <= 0 || progressBarWidth <= 0) return;

        const touchX = Math.max(0, Math.min(evt.nativeEvent.locationX, progressBarWidth));
        const newTime = (touchX / progressBarWidth) * duration;

        if (newTime >= 0 && newTime <= duration) {
          try {
            setCurrentTime(newTime);
            SoundPlayer.seek(newTime);
          } catch (e) {
            console.error('Error seeking audio during drag:', e);
          }
        }
      },
      onPanResponderRelease: () => {
        if (isPlaying) {
          SoundPlayer.play();
        }
      },
    })
  ).current;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const thumbPosition = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Audio Player Controls</Text>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        <TouchableWithoutFeedback onPress={handleProgressBarPress}>
          <View
            pointerEvents="auto"
            ref={progressBarRef}
            style={styles.progressBar}
            {...panResponder.panHandlers}
          >
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            <View style={[styles.thumb, { left: `${thumbPosition}%` }]} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.editorContainer}>
        <QuillEditor initialValue={editorContent} onTextChange={handleEditorChange} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
          <Text style={styles.buttonText}>-3s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={pickAndPlayAudio}>
          <Text style={styles.buttonText}>Pick & Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={pauseAudio}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={stopAudio}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
          <Text style={styles.buttonText}>+3s</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  thumb: {
    position: 'absolute',
    top: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timeText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  editorContainer: {
    flex: 1, // Ensure the editor takes up remaining space
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Basic;