const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };

  return new Date(dateString).toLocaleString(undefined, options);
};
const formatDateOnly = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Date(dateString).toLocaleTimeString(undefined, options);
};

export { formatDate, formatDateOnly, formatTime };
