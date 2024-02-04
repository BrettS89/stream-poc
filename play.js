const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

let initialized = false;

const hlsOutputPath = './output';

const streamEmpty = (s) => {
  return ffmpeg()
    .input('./blank.mp4')
    .inputFormat('mp4')
    .inputOptions([
      '-readrate 1',
      '-stream_loop -1'
    ])
    .inputFormat('mp4')
    .outputOptions([
      '-s 1920x1080',
      '-hls_flags delete_segments+append_list+omit_endlist',
      '-f hls',
      '-hls_time 10',
      '-hls_list_size 5',
      '-start_number 0',
      '-hls_segment_filename ' + path.join(hlsOutputPath, 'segment%d.ts'),
    ])
    .output(path.join(hlsOutputPath, 'index.m3u8'))
    .on('end', () => {
      // stream();
    });
};

const stream = async (initialized, videos, hlsOutputPath) => {
  if (!videos.length) return;

  const video = videos.shift();

  if (!initialized) {
    initialized = true;

    const currentTime = new Date().getTime();
    const videoTime = new Date(video.start).getTime();

    if (videoTime > currentTime) return;

    const differenceInSeconds = (currentTime - videoTime) / 1000;

    return ffmpeg()
      .input(video.url)
      .inputFormat('mp4')
      .seekInput(differenceInSeconds)
      .inputOptions([
        '-readrate 1',
      ])
      .inputFormat('mp4')
      .outputOptions([
        '-s 1920x1080',
        '-hls_flags delete_segments+append_list+omit_endlist',
        '-f hls',
        '-hls_time 10',
        '-hls_list_size 6',
        '-start_number 0',
        '-hls_segment_filename ' + path.join(hlsOutputPath, 'segment%d.ts'),
      ])
      .output(path.join(hlsOutputPath, 'index.m3u8'))
      .on('end', () => {
        // stream();
      });
  } else {
    return ffmpeg()
      .input(video.url)
      .inputFormat('mp4')
      .inputOptions([
        '-readrate 1',
      ])
      .inputFormat('mp4')
      .outputOptions([
        '-s 1920x1080',
        '-hls_flags delete_segments+append_list+omit_endlist',
        '-f hls',
        '-hls_time 10',
        '-hls_list_size 6',
        '-start_number 0',
        '-hls_segment_filename ' + path.join(hlsOutputPath, 'segment%d.ts'),
      ])
      .output(path.join(hlsOutputPath, 'index.m3u8'))
      .on('end', () => {
        // stream();
      });
  }
};

module.exports = {
  stream,
  streamEmpty,
}