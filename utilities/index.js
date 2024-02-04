const getTimeDifference = (isoString) => {
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
