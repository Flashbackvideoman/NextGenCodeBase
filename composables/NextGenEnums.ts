export const CalibrationTabs = {
  tab_calibrationRuns: 0,
  tab_headwaterBasinGage: 1,
  tab_formulation: 2,
  tab_tuningControls: 3,
  tab_optimizationMetrics: 4,
  tab_statusRun: 5,
};

export const EvaluationTabs = {
  tab_calibrationRuns: 0,
  tab_evaluate: 1,
  tab_selectAltIteration: 2,
  tab_runStatus: 3,
};

export const ForecastTabs = {
  tab_calibrationRuns: 0,
  tab_forecastRuns: 1,
  tab_setupForecast: 2,
  tab_statusRun: 3,
  tab_results: 4,
};

export const VerificationTabs = {
  tab_calibrationRuns: 0,
  tab_results: 1,
};

export const NextgenPages = {
  page_calibration: 1,
  page_evaluation: 2,
  page_forecast: 3,
  page_verification: 4,
};

export const CalibrationHelpPages = {
  previousRuns: 1,
  headwaterBasinGage: 2,
  formulation: 3,
  tuningControls: 4,
  optimizationMetrics: 5,
  runStatus: 6,
  results: 7,
};

export const TokenExpired = 498;

export const ValidationPlotNames = [
  "Bar Chart Metrics",
  "Flow Duration Curves Validation",
  "Hydrograph Validation",
  "Streamflow Validation Precipitation",
];

export const ToastTimeout = {
  timeout3000: 3000,
  timeout5000: 5000,
  timeout6000: 6000,
  timeout10000: 10000,
};

export const StatusTypes = [
  { status: "Done", filterValue: "Done" },
  { status: "Saved", filterValue: "Saved" },
  { status: "Ready", filterValue: "Ready" },
  { status: "Running", filterValue: "Running" },
  { status: "Cancelled", filterValue: "Cancelled" },
  { status: "Failed", filterValue: "Failed" },
  { status: "Server Error", filterValue: "Server Error" },
];

export const ServerCodes = [
  { "code": 200, "error": "OK" },
  { "code": 201, "error": "Created" },
  { "code": 202, "error": "Accepted" },
  { "code": 203, "error": "Non-Authoritative Information" },
  { "code": 204, "error": "No Content" },
  { "code": 205, "error": "Reset Content" },
  { "code": 206, "error": "Partial Content" },
  { "code": 207, "error": "Multi-Status" },
  { "code": 208, "error": "Already Reported" },
  { "code": 226, "error": "IM Used" },
  { "code": 300, "error": "Multiple Choices" },
  { "code": 301, "error": "Moved Permanently" },
  { "code": 302, "error": "Found" },
  { "code": 303, "error": "See Other" },
  { "code": 304, "error": "Not Modified" },
  { "code": 305, "error": "Use Proxy" },
  { "code": 307, "error": "Temporary Redirect" },
  { "code": 308, "error": "Permanent Redirect" },
  { "code": 400, "error": "Bad Request" },
  { "code": 401, "error": "Unauthorized" },
  { "code": 402, "error": "Payment Required" },
  { "code": 403, "error": "Forbidden" },
  { "code": 404, "error": "The server cannot find the requested resource" },
  { "code": 405, "error": "Method Not Allowed" },
  { "code": 406, "error": "Not Acceptable" },
  { "code": 407, "error": "Proxy Authentication Required" },
  { "code": 408, "error": "Request Timeout" },
  { "code": 409, "error": "Conflict" },
  { "code": 410, "error": "Gone" },
  { "code": 411, "error": "Length Required" },
  { "code": 412, "error": "Precondition Failed" },
  { "code": 413, "error": "Payload Too Large" },
  { "code": 414, "error": "URI Too Long" },
  { "code": 415, "error": "Unsupported Media Type" },
  { "code": 416, "error": "Range Not Satisfiable" },
  { "code": 417, "error": "Expectation Failed" },
  { "code": 418, "error": "I'm a teapot" },
  { "code": 421, "error": "Misdirected Request" },
  { "code": 422, "error": "Unprocessable Entity" },
  { "code": 423, "error": "Locked" },
  { "code": 424, "error": "Failed Dependency" },
  { "code": 425, "error": "Too Early" },
  { "code": 426, "error": "Upgrade Required" },
  { "code": 428, "error": "Precondition Required" },
  { "code": 429, "error": "Too Many Requests" },
  { "code": 431, "error": "Request Header Fields Too Large" },
  { "code": 451, "error": "Unavailable For Legal Reasons" },
  { "code": 500, "error": "Internal Server Error" },
  { "code": 501, "error": "Not Implemented" },
  { "code": 502, "error": "Bad Gateway" },
  { "code": 503, "error": "Service Unavailable" },
  { "code": 504, "error": "Gateway Timeout" },
  { "code": 505, "error": "HTTP Version Not Supported" },
  { "code": 506, "error": "Variant Also Negotiates" },
  { "code": 507, "error": "Insufficient Storage" },
  { "code": 508, "error": "Loop Detected" },
  { "code": 510, "error": "Not Extended" },
  { "code": 511, "error": "Network Authentication Required" }
]

export const JobStatusAction = {
  delete: 1,
  archive: 2,
  unarchive: 3
};
