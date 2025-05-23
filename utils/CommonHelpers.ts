import { ServerCodes } from '@/composables/NextgenEnums';
import { DateTime } from "luxon";

/**
 * Checks if an object is a valid Date object
 * @param obj
 * @returns {boolean}
 */
export const isValidDate = (obj: any): boolean => {
  return obj && obj instanceof Date && !isNaN(obj.getTime());
};

/**
 * Checks if an object is a valid DateTime object
 * @param obj
 * @returns {boolean}
 */
export const isValidDateTime = (obj: any): boolean => {
  return obj && DateTime.isDateTime(obj) && obj.isValid;
};

/**
 * Checks if a variable is not null and not undefined
 * @param variable
 * @returns {boolean}
 */
export const isNotNullOrUndefined = (variable: any): boolean => {
  return variable !== null && variable !== undefined;
};

/**
 * Checks if Calibration job status is 'Saved' or 'Ready'
 * @param status
 * @returns {boolean}
 */
export const isCalibrationJobStatusSavedOrReady = (
  status?: string
): boolean => {
  return status === "Saved" || status === "Ready";
};

/**
 * Check if Calibration job status is 'Done', 'Cancelled', 'Failed', or 'Server Error'
 * @param status
 * @returns {boolean}
 */
export const isCalibrationJobFinished = (status?: string): boolean => {
  return (
    status === "Done" ||
    status === "Cancelled" ||
    status === "Failed" ||
    status === "Server Error"
  );
};

export const fixFloatToFivePlaces = (f: number) => {
  let s = f.toString();
  let p = s.indexOf(".");
  if (p !== -1) {
    if (s.substring(p + 1).length > 5) {
      return f.toFixed(5);
    } else {
      return f;
    }
  } else {
    return f;
  }
};

/**
 * Get overall Calibration/Validation status to display in PreviousCalibrationsRuns tab
 * @param calibrationStatus
 * @param validationControlStatus
 * @param validationBestStatus
 * @returns {string}
 */
export const getOverallCalibrationValidationStatus = (
  calibrationStatus: string,
  validationControlStatus?: string,
  validationBestStatus?: string
): string => {
  // simply show calibration status if it is not 'Done'
  if (calibrationStatus !== "Done") {
    return `Calibration ${calibrationStatus}`;
  } else if (
    calibrationStatus === "Done" &&
    validationControlStatus &&
    validationControlStatus === "Running"
  ) {
    return `Calibration Done, Validation Control Running`;
  } else if (
    calibrationStatus === "Done" &&
    validationBestStatus &&
    validationBestStatus === "Running"
  ) {
    return `Calibration Done, Validation Best Running`;
  } else if (
    calibrationStatus === "Done" &&
    validationControlStatus &&
    validationControlStatus === "Done" &&
    validationBestStatus &&
    validationBestStatus === "Done"
  ) {
    return "Done";
  } else if (calibrationStatus === "Done" && validationControlStatus) {
    // get the overall status of validation control and validation best
    const validationControlBestStatus = getValidControlAndValidBestStatus(
      validationControlStatus,
      validationBestStatus
    );
    return `Calibration Done, Validation ${validationControlBestStatus}`;
  }
  return "";
};

/**
 * Get the status of valid_control and valid_best
 * @param validControl
 * @param validBest
 * @returns {string}
 */
export const getValidControlAndValidBestStatus = (
  validControlStatus: string,
  validBestStatus?: string
): string => {
  if (validControlStatus === "Saved" || validBestStatus === "Saved") {
    return "Saved";
  } else if (validControlStatus === "Ready" || validBestStatus === "Ready") {
    return "Ready";
  } else if (
    validControlStatus === "Running" ||
    validBestStatus === "Running"
  ) {
    return "Running";
  } else if (
    validControlStatus === "Cancelled" ||
    validBestStatus === "Cancelled"
  ) {
    return "Cancelled";
  } else if (validControlStatus === "Failed" || validBestStatus === "Failed") {
    return "Failed";
  } else if (
    validControlStatus === "Server Error" ||
    validBestStatus === "Server Error"
  ) {
    return "Server Error";
  } else if (validControlStatus === "Done" && validBestStatus === "Done") {
    return "Done";
  } else {
    return "Unknown";
  }
};

/**
 * Get the combined status of forecast_forcing_download_status and forecast_status
 * @param forecastForcingDownloadStatus
 * @param forecastStatus
 * @returns {string}
 */
export const getOverallForecastStatus = (
  forecastForcingDownloadStatus: string,
  forecastStatus: string
): string => {
  if (
    [
      "Saved",
      "Ready",
      "Running",
      "Cancelled",
      "Failed",
      "Server Error",
    ].includes(forecastForcingDownloadStatus)
  ) {
    return `Forcing Download ${forecastForcingDownloadStatus}`;
  } else if (forecastForcingDownloadStatus === "Done") {
    if (
      [
        "Saved",
        "Ready",
        "Running",
        "Cancelled",
        "Failed",
        "Server Error",
      ].includes(forecastStatus)
    ) {
      return `Forcing Download Done, Forecast ${forecastStatus}`;
    } else if (forecastStatus === "Done") {
      return "Done";
    } else {
      return "Unknown";
    }
  } else {
    return "Unknown";
  }
};

export const arraysEqual = (arr1: any, arr2: any) => {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort both arrays (if they contain primitives)
  arr1 = arr1.sort();
  arr2 = arr2.sort();

  // Iterate over each element in the arrays
  for (let i = 0; i < arr1.length; i++) {
    // If the elements are not equal, return false
    if (arr1[i] !== arr2[i]) {
      // If the elements are objects, recursively compare them
      if (typeof arr1[i] === "object" && typeof arr2[i] === "object") {
        if (!arraysEqual(arr1[i], arr2[i])) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  // If all elements are equal, return true
  return true;
};

export function getErrorTextFromStatus(status: number): string {
  const result = ServerCodes.find(codeEntry => codeEntry.code === status);
  return result ? result.error : "Unknown error code";
}

