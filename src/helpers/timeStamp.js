function convertDateAsLocalTime(date) {
  const time = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formattedDate = time.toLocaleString("en-US", options);

  return formattedDate;
}

export default convertDateAsLocalTime;
