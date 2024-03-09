const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { getTimeDifferenceForPlayback } = require('../utilities');

const blank = path.join(__dirname, '..', 'blank.mp4');
const hlsOutputPath = path.join(__dirname, '..', 'output');

const blankOutputOptions = [
  '-s 1920x1080',
  '-hls_flags delete_segments+append_list+omit_endlist',
  '-f hls',
  '-hls_time 5',
  '-hls_list_size 4',
  '-start_number 0',
  '-hls_segment_filename ' + path.join(hlsOutputPath, 'segment%d.ts'),
]

const outputOptions = [
  '-s 1920x1080',
  '-hls_flags delete_segments+append_list+omit_endlist',
  '-f hls',
  '-hls_time 10',
  '-hls_list_size 5',
  '-start_number 0',
  '-hls_segment_filename ' + path.join(hlsOutputPath, 'segment%d.ts'),
];

const streamEmpty = () => {
  console.log('stream from empty');

  const command = ffmpeg()
    .input(blank)
    .inputFormat('mp4')
    .inputOptions([
      '-readrate 1',
      '-stream_loop -1'
    ])
    .inputFormat('mp4')
    .outputOptions(blankOutputOptions)
    .output(path.join(hlsOutputPath, 'index.m3u8'))
    .on('error', () => {})
    .on('end', () => {});

  command.run();

  return command;
};

const streamFromStart = (video, onEndCallback) => {
  console.log('stream from start');

  const command = ffmpeg()
    .input(video.url)
    .inputFormat('mp4')
    .inputOptions([
      '-readrate 1',
    ])
    .inputFormat('mp4')
    .outputOptions(outputOptions)
    .output(path.join(hlsOutputPath, 'index.m3u8'))
    .on('error', () => {})
    .on('end', onEndCallback);

  command.run();

  return command;
};

const streamFromMiddle = (video, onEndCallback) => {
  console.log('stream from middle');

  const { differenceInSeconds } = getTimeDifferenceForPlayback(video.start);

  const command = ffmpeg()
    .input(video.url)
    .inputFormat('mp4')
    .seekInput(differenceInSeconds)
    .inputOptions([
      '-readrate 1',
    ])
    .inputFormat('mp4')
    .outputOptions(outputOptions)
    .output(path.join(hlsOutputPath, 'index.m3u8'))
    .on('error', () => {})
    .on('end', onEndCallback);

  command.run();

  return command;
};

module.exports = {
  streamEmpty,
  streamFromStart,
  streamFromMiddle,
};
