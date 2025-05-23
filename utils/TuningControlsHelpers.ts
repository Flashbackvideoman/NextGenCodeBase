
/**
 * Checks if EDS errors exist in Tuning Tab static data
 * 
 * @param data - Tuning Tab static data
 * @returns {string}  Error message
 */
export const ifEDSErrorsExist = (data: any): string => {
  if (data.eds_errors) {
    const edsErrorMessage = data.eds_errors.message;

    // if the error message is that the connection failed or timed out, we return a specific message
    if (edsErrorMessage && edsErrorMessage.includes('failed to connect or timed out') === true) {
      return 'Calibration setup can not be completed because Enterprise Data Services is unavailable.'
    }

    // we don't know what the error is, so we just return the message
    if (edsErrorMessage) {
      return edsErrorMessage;
    }
  }

  return '';
};