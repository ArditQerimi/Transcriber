// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Slider from '@react-native-community/slider';
// import WebView from 'react-native-webview';
// //import DocumentPicker from 'react-native-document-picker';

// const App = () => {
//   const [audioUri, setAudioUri] = useState<string | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const permission = Platform.Version >= 33
//           ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
//           : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
//         const granted = await PermissionsAndroid.request(permission, {
//           title: 'Storage Permission',
//           message: 'App needs access to your storage to pick MP3 files.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         });
//         return granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
//       } catch (err) {
//         console.log('Error requesting storage permission:', err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const pickAudioFile = async () => {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) {
//       Alert.alert('Storage permission denied');
//       return;
//     }

//     try {
//       const result = await DocumentPicker.pickSingle({
//         type: [DocumentPicker.types.audio],
//       });
//       debugger
//            console.log(
//            result.uri,
//            result.type, 
//            result.name,
//            result.size,
//       );
//       if (!DocumentPicker.isCancel(result)) {
//         const uri = result.uri;
//         setAudioUri(Platform.OS === 'android' ? `file://${uri}` : uri); // Add file:// for Android
//         setProgress(0);
//         setDuration(0);
//       }
//     } catch (err) {
//       debugger
//       if (!DocumentPicker.isCancel(err)) {
//         debugger
//         Alert.alert('Error picking file');
//       }
//     }
//   };

//   const togglePlayback = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   // Update progress from WebView
//   const onMessage = (event: any) => {
//     const data = JSON.parse(event.nativeEvent.data);
//     if (data.duration) {
//       setDuration(data.duration);
//     }
//     if (data.currentTime) {
//       setProgress(data.currentTime);
//     }
//   };

//   // Seek to position when slider changes
//   const handleSliderChange = (value: number) => {
//     setProgress(value);
//     // Send seek command to WebView
//     if (audioUri) {
//       webViewRef.current?.postMessage(JSON.stringify({ seekTo: value }));
//     }
//   };

//   const webViewRef = React.useRef<WebView>(null);

//   // Simulate progress for testing (optional, replace with WebView timeupdate)
//   useEffect(() => {
//     let interval: ReturnType<typeof setInterval>;
//     if (isPlaying && audioUri && !duration) {
//       interval = setInterval(() => {
//         setProgress((prev) => {
//           const newProgress = prev + 0.1;
//           if (newProgress >= 100) {
//             setIsPlaying(false);
//             return 100;
//           }
//           return newProgress;
//         });
//       }, 100);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying, audioUri, duration]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>MP3 Player</Text>
//       <Button title="Pick MP3 File" onPress={pickAudioFile} />
//       {audioUri && (
//         <>
//           <Text style={styles.info}>Playing: {audioUri.split('/').pop()}</Text>
//           <WebView
//             ref={webViewRef}
//             source={{
//               html: `
//                 <audio id="player" ${isPlaying ? 'autoplay' : ''}>
//                   <source src="${audioUri}" type="audio/mp3" />
//                 </audio>
//                 <script>
//                   const player = document.getElementById('player');
//                   player.onloadedmetadata = () => {
//                     window.ReactNativeWebView.postMessage(
//                       JSON.stringify({ duration: player.duration })
//                     );
//                   };
//                   player.ontimeupdate = () => {
//                     window.ReactNativeWebView.postMessage(
//                       JSON.stringify({ currentTime: player.currentTime })
//                     );
//                   };
//                   window.addEventListener('message', (event) => {
//                     const data = JSON.parse(event.data);
//                     if (data.seekTo) {
//                       player.currentTime = data.seekTo;
//                     }
//                   });
//                   player.onplay = () => {
//                     window.ReactNativeWebView.postMessage(
//                       JSON.stringify({ isPlaying: true })
//                     );
//                   };
//                   player.onpause = () => {
//                     window.ReactNativeWebView.postMessage(
//                       JSON.stringify({ isPlaying: false })
//                     );
//                   };
//                 </script>
//               `,
//             }}
//             style={styles.webview}
//             onMessage={onMessage}
//           />
//           <Button
//             title={isPlaying ? 'Pause' : 'Play'}
//             onPress={togglePlayback}
//           />
//           <Text>Progress: {duration ? Math.round((progress / duration) * 100) : 0}%</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={duration || 100}
//             value={progress}
//             onValueChange={handleSliderChange}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   info: {
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   webview: {
//     width: 0,
//     height: 0,
//   },
//   slider: {
//     width: '80%',
//     marginTop: 10,
//   },
// });

// export default App;