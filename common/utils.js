const padNumber = (num) => (
  num > 9 ? num.toString() : '0' + num
);

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  
  return `${year}-${month}-${day}`;
};

export { padNumber, getDateString };