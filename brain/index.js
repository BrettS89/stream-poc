const config = require('../config');
const { data: videos, stream } = require('../video');
const { getTimeDifference } = require('../utilities');

let ffmpegCommand;

const onPlayCallback = () => config.isStreamingContent = true;

const endCallback = () => {
  const t = getTimeDifference(videos[0]?.start);

  if (!t || t.differenceInSeconds > 13) {
    ffmpegCommand = stream({
      initialized: config.initialized,
      videos: [],
    });
  }

  config.isStreamingContent = false;
};

const logic = () => {
  if (!config.initialized) {
    ffmpegCommand = stream({
      initialized: config.initialized,
      videos,
      onEndCallback: endCallback,
      onPlayCallback,
    });

    config.initialized = true;

    return;
  }

  if (config.isStreamingContent) return;

  if (!videos[0]) ffmpegCommand = stream({
    initialized: config.initialized,
    videos: [],
  });

  const t = getTimeDifference(videos[0]?.start);

  if (t?.differenceInSeconds <= 0) {
    try {
      ffmpegCommand.kill();
    } catch {}

    ffmpegCommand = stream({
      initialized: config.initialized,
      videos,
      onEndCallback: endCallback,
      onPlayCallback,
    });
  }
};

const run = () => {
  setInterval(logic, 1000);
};

module.exports = {
  run,
};
