// import TrackPlayer from 'react-native-track-player';

// module.exports = async function () {
//   TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
//   TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
//   TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.stop());
//   TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
//   TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
//   TrackPlayer.addEventListener('remote-jump-forward', async () => {
//     const progress = await TrackPlayer.getProgress();
//     TrackPlayer.seekTo(progress.position + 10); 
//   });
//   TrackPlayer.addEventListener('remote-jump-backward', async () => {
//     const progress = await TrackPlayer.getProgress();
//     TrackPlayer.seekTo(Math.max(progress.position - 10, 0)); 
//   });
//   TrackPlayer.addEventListener('remote-seek', ({ position }) => TrackPlayer.seekTo(position));
// };