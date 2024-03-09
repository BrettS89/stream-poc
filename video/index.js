const { streamFromStart, streamFromMiddle, streamEmpty } = require('./ffmpeg');
const { getTimeDifference } = require('../utilities');

const stream = ({
  initialized,
  videos,
  onEndCallback = () => {},
  onPlayCallback = () => {},
}) => {
  const video = videos[0];

  if (!video) return streamEmpty();

  if (!initialized) {
    const { currentTime,videoTime } = getTimeDifference(video.start);

    // if broadcast is supposed to have already started
    if (videoTime <= currentTime) {
      videos.shift();

      onPlayCallback();

      return streamFromMiddle(video, onEndCallback);
    }

    // if its scheduled too far into the future (> 10 seconds)
    if ((videoTime - currentTime ) > 10) {
      return streamEmpty();
    }

    // if its scheduled to start in less than 10 seconds
    if (videoTime - currentTime <= 10) {
      videos.shift();

      onPlayCallback();

      return streamFromStart(video, onEndCallback);
    }
  }

  const { currentTime, videoTime } = getTimeDifference(video.start);

  if ((videoTime - currentTime ) > 10) {
    return streamEmpty();
  }

  onPlayCallback();

  videos.shift();

  return streamFromStart(video, onEndCallback);
};

// const vids = [
//   {
//     url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
//     start: '2024-02-05T18:54:00.998Z',
//     duration: 734,
//   },
//   {
//     url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     start: '2024-02-05T19:06:15.998Z',
//     duration: 596,
//   }
// ];

const vids = [
  {
    url: '/Users/brettsodie/Code/tv/stream-poc/content/The Lawfare Primary.mp4',
    start: '2024-02-06T01:40:53.735Z',
    duration: 1916,
  },
  {
    url: `/Users/brettsodie/Code/tv/stream-poc/content/This 'Bio-Hacking' Millionaire Reveals Vapid Life View In Viral Video.mp4`,
    start: '2024-02-06T02:12:50.735Z',
    duration: 682,
  },
  {
    url: `/Users/brettsodie/Code/tv/stream-poc/content/Transforming A Strangers Body in 60 Days.mp4`,
    start: '2024-02-06T02:24:13.735Z',
    duration: 1347
  },
  {
    url: `/Users/brettsodie/Code/tv/stream-poc/content/Jim Cornette on AEW Collision's Record Low Ratings.mp4`,
    start: '2024-02-06T02:46:41.735Z',
    duration: 774
  },
  {
    url: `/Users/brettsodie/Code/tv/stream-poc/content/How To Stay Motivated As A Natty.mp4`,
    start: '2024-02-06T02:59:36.735Z',
    duration: 926
  },
  {
    url: `/Users/brettsodie/Code/tv/stream-poc/content/Patrick Bet-David Club Random with Bill Maher.mp4`,
    start: '2024-02-06T03:15:03.735Z',
    duration: 123,
  }
];

module.exports = {
  stream,
  data: vids,
};
