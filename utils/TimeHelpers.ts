import { DateTime, Duration } from "luxon";


/**
 * Converts a string in ISO format or a Date object to a DateTime object
 * @param d
 * @returns {DateTime} DateTime object
 */
export const convertISOStringOrDateToDateTime = (d: string | Date): any => {
  if (typeof d === 'string') {
    return DateTime.fromISO(d, { zone: 'utc' });
  } else {
    return DateTime.fromJSDate(d, { zone: 'utc' });
  }
};

/**
 * Converts a string in ISO format or a Date object to a string in the format "yyyy-MM-dd HH:mm"
 * @param d 
 * @returns {string} string in the format "yyyy-MM-dd HH:mm"
 */
export const formatISOStringOrDateToYYYYMMDDHHMM = ( d: string | Date ): string => {
  let dateTime;

  // Check if the input is already in 'yyyy-MM-dd HH:mm' format
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(d)) {
    // If it's already in 'yyyy-MM-dd HH:00' format, return it directly
    return d;
  }

  // convert string or Date object to Luxon DateTime in UTC
  dateTime = convertISOStringOrDateToDateTime(d);

  // Return the formatted date in 'yyyy-MM-dd HH:mm' format
  return dateTime.toFormat('yyyy-MM-dd HH:mm');
};

/**
 * Converts a string in ISO format or a Date object to a string in the format "yyyy-MM-dd"
 * @param d 
 * @returns {string} string in the format "yyyy-MM-dd"
 */
export const formatISOStringOrDateToYYYYMMDD = ( d: string | Date ): string => {
  let dateTime;

  // Check if the input is already in 'yyyy-MM-dd' format
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    // If it's already in 'yyyy-MM-dd' format, return it directly
    return d;
  }

  // convert string or Date object to Luxon DateTime in UTC
  dateTime = convertISOStringOrDateToDateTime(d);

  // Return the formatted date in 'yyyy-MM-dd' format
  return dateTime.toFormat('yyyy-MM-dd');
};

/**
 * Converts a Date object to a string in the format "MM-dd yyyy 'at' HH:mm:ss 'UTC'"
 * @param d
 * @returns {string} string in the format "MM-dd yyyy 'at' HH:mm:ss 'UTC'"
 */
export const formatDateForRunOnString = (d: Date): string => {
  const dateTime = DateTime.fromJSDate(d, { zone: 'utc' });
  return dateTime.toFormat("MM-dd yyyy 'at' HH:mm:ss 'UTC'");
};

/**
 * Takes a date object and converts it to a string in the specified timezone format
 * @param date
 * @param locale 
 * @returns string in the format "Sep 8, 2024 14:10:43"
 */
export const convertTimeZone = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });  
};

/**
 * This function is for creating a time range that encompasses the calibration and simulation times for testing
 * Currently set to pad the range by one month before and after
 * @param calibration_start_time
 * @param calibration_end_time
 * @param simulation_start_time
 * @param simulation_end_time
 * @returns {time_range} object with rangeStart and rangeEnd in ISO format
 */
export function calculateTimeRange(
  calibration_start_time: string,
  calibration_end_time: string,
  simulation_start_time: string,
  simulation_end_time: string
): { rangeStart: string; rangeEnd: string } {
  const startDates = [
    DateTime.fromISO(calibration_start_time),
    DateTime.fromISO(simulation_start_time),
  ];

  const endDates = [
    DateTime.fromISO(calibration_end_time),
    DateTime.fromISO(simulation_end_time),
  ];

  const minDate = DateTime.min(...startDates);
  const maxDate = DateTime.max(...endDates);

  // pad the range by one month before and after
  const paddedStart = minDate.minus({ months: 1 });
  const paddedEnd = maxDate.plus({ months: 1 });

  // convert a DateTime object to a string in ISO format
  const formatDate = (date: any): string => date.toISO();

  const rangeStart = formatDate(paddedStart);
  const rangeEnd = formatDate(paddedEnd);

  return { rangeStart, rangeEnd };
};

/**
 * Calculates the elapsed time between two Date objects
 * @param start_time Date object representing the start time
 * @param end_time Date object representing the end time
 * @returns {string} string of the elapsed time in 'hh:mm:ss or 'd 'Days,' hh:mm:ss' format
 */
export function calculateElapsedTime(start_time: Date, end_time: Date): string {
  const start = DateTime.fromJSDate(start_time);
  const end = DateTime.fromJSDate(end_time);

  // create a Duration object representing the difference between the two Date objects
  let diffDuration = end.diff(start, ["days", "hours", "minutes", "seconds"]);

  // Floor the seconds to remove fractions
  diffDuration = diffDuration.set({ seconds: Math.floor(diffDuration.seconds) });
  
  // return a formatted string in 'hh:mm:ss' or 'd 'Days,' hh:mm:ss' format
  return formatDuration(diffDuration);
};

/**
 * Format string representation of a Duration object from format 'hh:mm:ss.sss' to 'd 'Days,' hh:mm:ss'
 * @param elapsedTime string representation of a Duration object in the format 'hh:mm:ss' or 'hh:mm:ss.ssssss'
 * @returns {string} string representation of a Duration object in 'hh:mm:ss or 'd 'Days,' hh:mm:ss' format
 */
export function formatElapsedTime(elapsedTime: string): string {
  // parse out hours, minutes, and seconds from the elapsed_time string
const [hours, minutes, rawSeconds] = elapsedTime.split(':');
const seconds = Number(rawSeconds?.split('.')[0]); // remove decimal part safely

  // convert elapsedTime string into a Duration object
  const duration = Duration.fromObject({
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: Math.floor(seconds) // ignore milliseconds
  });

  // return the formatted string in 'hh:mm:ss' or 'd 'Days,' hh:mm:ss' format
  return formatDuration(duration);
}; 

/** 
 * Add up all the Duration strings in the supplied array and return the total duration in 'd 'Days,' hh:mm:ss' format
 * @param elapsedTimesArray array of strings in the format 'hh:mm:ss' or 'hh:mm:ss.ssssss'
 * @returns {string} string representation of a Duration object in 'hh:mm:ss or 'd 'Days,' hh:mm:ss' format
 */
export function sumAndFormatElapsedTimes(elapsedTimesArray: string[]): string {
  // initialize the sum of durations
  let durationsSum: any = null;

  // iterate through the array of elapsed times
  elapsedTimesArray.forEach((elapsedTime) => {
    const [hours, minutes, rawSeconds] = elapsedTime.split(':');
    const seconds = Number(rawSeconds?.split('.')[0]); // remove decimal part safely

    const duration = Duration.fromObject({
      hours: hours || 0,
      minutes: minutes || 0,
      seconds: Math.floor(seconds), // ignore milliseconds
    });

    // add the duration to the sum
    if (!durationsSum) {
      durationsSum = duration;
    } else {
      durationsSum = durationsSum.plus(duration);
    }
  });

  // return the formatted sum of durations as 'hh:mm:ss' or 'd 'Days,' hh:mm:ss' format
  return formatDuration(durationsSum);
};

/**
 * Format Duration object to a string in 'hh:mm:ss' or 'd 'Days,' hh:mm:ss' format
 * @param duration Duration object
 * @returns {string} string representation of a Duration object in 'hh:mm:ss or 'd 'Days,' hh:mm:ss' format
 */
export function formatDuration(duration: any): string {
  // extract days, hours, minutes, and seconds
  let totalSeconds = Math.floor(duration.seconds);
  let totalMinutes = duration.minutes + Math.floor(totalSeconds / 60);
  let totalHours = duration.hours + Math.floor(totalMinutes / 60);
  let days = Math.floor(duration.as('days')) + Math.floor(totalHours / 24);

  // normalize the values
  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  // construct string in 'hh:mm:ss' or 'd 'Days,' hh:mm:ss' format
  const daysPart = days > 0 ? `${days} Days, ` : '';
  return daysPart + Duration.fromObject({ hours, minutes, seconds }).toFormat("hh:mm:ss");
};
