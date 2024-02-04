const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { getTimeDifference } = require('./utilities');
const video = require('./video');

const hlsOutputPath = './output';

let initialized = false;

const app = express();

if (!fs.existsSync(hlsOutputPath)) fs.mkdirSync(hlsOutputPath);

app.use(cors());
app.use(express.static(hlsOutputPath));

const videos = video.data;

let ffmpegCommand;
let isStreamingContent = false;

setInterval(() => {
  // check latest video
    // if its time to play, kill ffmpeg and play it (if start time is greater than or equal to current time)
    // shift video out of array
    // fetch next video after last video in array and push it into videos array
  
  // after latest video ends (do this in stream function end handler)
    // check time on next video, if greater than 10 seconds away, play blank.mp4

  if (!initialized) {
    ffmpegCommand = video.stream(false, videos, () => {
      const t =
        getTimeDifference(videos[0].start);

        if (t.differenceInSeconds > 13) {
          ffmpegCommand = video.stream(true, [], () => {});
        }
    }, () => isStreamingContent = true);

    initialized = true;
  } else {
    if (isStreamingContent) return;

    if (!videos[0]) ffmpegCommand = video.stream(true, [], () => {}, () => isStreamingContent = false);

    const { differenceInSeconds } =
      getTimeDifference(videos[0].start);

    if (differenceInSeconds <= 0) {
      try {
        ffmpegCommand.kill();
      } catch {}
      ffmpegCommand = video.stream(true, videos, () => {
        const t =
          getTimeDifference(videos[0].start);

        if (t.differenceInSeconds > 13) {
          ffmpegCommand = video.stream(true, [], () => {});
        }

        isStreamingContent = false;
      }, () => isStreamingContent = true);
    }
  }
}, 5000);

module.exports = app;
