const moment = require("moment");

const isValidDate = (date, name = "date") => {
  if (new Date(date).toString() === "Invalid Date") {
    throw { status: 400, message: `Invalid ${name}` };
  }
  return true;
};

const startOfDay = (date) => {
  isValidDate(date);
  return moment(date).startOf("day").toISOString();
};

const endOfDay = (date) => {
  isValidDate(date);
  return moment(date).endOf("day").toISOString();
};

const dateDifference = (startDate, endDate, type = "days") => {
  isValidDate(startDate, "startDate");
  isValidDate(endDate, "endDate");
  startDate = moment(startDate).utc();
  endDate = moment(endDate).utc();
  return endDate.diff(startDate, type);
};

const addDays = (startdate, days) => {
  isValidDate(startdate);
  return moment(moment(startdate, "YYYY-MM-DD").add(days, "days"));
};

const futureDate = (date) => {
  const currentDate = moment().utc();
  return moment(date).utc().diff(currentDate, "minutes") > 1 ? true : false;
};

module.exports = {
  startOfDay,
  endOfDay,
  dateDifference,
  addDays,
  futureDate,
};
