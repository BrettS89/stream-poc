const { streamFromStart, streamFromMiddle, streamEmpty } = require('./stream');
const { getTimeDifference } = require('../utilities');

const stream = (initialized, videos, onEndCallback, initCallback) => {
  const video = videos[0];

  if (!video) return streamEmpty();

  if (!initialized) {
    const { currentTime,videoTime, differenceInSeconds } = getTimeDifference(video.start);

    // if broadcast is supposed to have already started
    if (videoTime <= currentTime) {
      videos.shift();
      initCallback();
      return streamFromMiddle(video, onEndCallback);
    }

    // if its scheduled too far into the future (> 10 seconds)
    if ((videoTime - currentTime ) > 10) {
      return streamEmpty();
    }

    // if its scheduled to start in less than 10 seconds
    if (videoTime - currentTime <= 10) {
      videos.shift();
      initCallback();
      return streamFromStart(video, onEndCallback);
    }
  }

  const { currentTime, videoTime, differenceInSeconds } = getTimeDifference(video.start);

  if ((videoTime - currentTime ) > 10) {
    return streamEmpty();
  }

  initCallback();
  videos.shift();
  return streamFromStart(video, onEndCallback);
};

const vids = [
  {
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    start: '2024-02-04T18:57:00.998Z',
  },
  {
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    start: '2024-02-04T19:28:23.998Z',
  }
];

module.exports = {
  stream,
  data: vids,
};
