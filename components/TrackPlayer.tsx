// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import TrackPlayer, { Capability, usePlaybackState } from 'react-native-track-player';
// import Slider from '@react-native-community/slider';

// const tracks = [
//   {
//     id: '1',
//     url: 'https://sample-music.netlify.app/death bed.mp3',
//     title: 'Death Bed',
//     artist: 'Powfu',
//     artwork: 'https://images-na.ssl-images-amazon.com/images/I/A1LVEJikmZL._AC_SX425_.jpg',
//     duration: 173,
//   },
// ];

// export default function TrackPlayerComponent() {
//   const playbackState = usePlaybackState();
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     async function setupPlayer() {
//       try {
//         // Check if player is already initialized
//         const state = await TrackPlayer.getState();
//         if (state === 'none') {
//           await TrackPlayer.setupPlayer();
//         }

//         await TrackPlayer.updateOptions({
//           capabilities: [
//             Capability.Play,
//             Capability.Pause,
//             Capability.SkipToNext,
//             Capability.SkipToPrevious,
//             Capability.SeekTo,
//           ],
//           compactCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
//           android: {
//             // appKilledPlaybackBehavior: 'StopPlaybackAndRemoveNotification',
//           },
//         });
//         await TrackPlayer.add(tracks);
//       } catch (error) {
//         console.error('Player setup error:', error);
//       }
//     }
//     setupPlayer();

//     return () => {
//       TrackPlayer.reset(); // Cleanup on unmount
//     };
//   }, []);

//   const togglePlayback = async () => {
//     const currentState = await TrackPlayer.getState();
//     if (currentState === 'playing') {
//       await TrackPlayer.pause();
//       setIsPlaying(false);
//     } else {
//       await TrackPlayer.play();
//       setIsPlaying(true);
//     }
//   };

//   const skipForward = async () => {
//     const progress = await TrackPlayer.getProgress();
//     await TrackPlayer.seekTo(Math.min(progress.position + 10, progress.duration));
//   };

//   const skipBackward = async () => {
//     const progress = await TrackPlayer.getProgress();
//     await TrackPlayer.seekTo(Math.max(progress.position - 10, 0));
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{tracks[0].title}</Text>
//       <Text style={styles.artist}>{tracks[0].artist}</Text>
//       <Text>{formatTime(position)} / {formatTime(duration)}</Text>
//       <Slider
//         style={{ width: 300, height: 40 }}
//         minimumValue={0}
//         maximumValue={duration}
//         value={position}
//         onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
//       />
//       <View style={styles.controls}>
//         <TouchableOpacity onPress={skipBackward}>
//           <Text style={styles.buttonText}>Rewind 10s</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={togglePlayback}>
//           <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={skipForward}>
//           <Text style={styles.buttonText}>Forward 10s</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 20, fontWeight: 'bold' },
//   artist: { fontSize: 16, color: '#666' },
//   button: { marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 },
//   buttonText: { color: '#fff', fontSize: 16 },
//   controls: { flexDirection: 'row', justifyContent: 'space-between', width: 300, marginTop: 10 },
// });