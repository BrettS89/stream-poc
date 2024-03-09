const getTimeDifference = (isoString) => {
  if (!isoString) return null;

  const currentTime = new Date().getTime();
  const videoTime = new Date(isoString).getTime();

  const differenceInSeconds = (videoTime - currentTime) / 1000;

  return {
    videoTime,
    currentTime,
    differenceInSeconds,
  };
};

const getTimeDifferenceForPlayback = (isoString) => {
  const currentTime = new Date().getTime();
  const videoTime = new Date(isoString).getTime();

  const differenceInSeconds = (currentTime - videoTime) / 1000;

  return {
    videoTime,
    currentTime,
    differenceInSeconds,
  };
};


module.exports = {
  getTimeDifference,
  getTimeDifferenceForPlayback,
};

const g = (isoString, duration /* time in seconds */) => {
  const date = new Date(isoString).getTime() / 1000;

  const nextAvailableTime = new Date((date + duration + 1) * 1000);

  return nextAvailableTime.toISOString();
};
