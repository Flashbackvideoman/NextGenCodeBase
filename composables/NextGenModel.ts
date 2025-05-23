import type { ToastMessageOptions } from "primevue/toast"

export interface User {
  uid: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface FooterData {
  version: string;
  contact_email: string;
}

export interface CreatedCalibrationRun {
  message: string;
  calibration_run_id: number;
}

// properties interface / type
export interface ComponentPropsTitle {
  title: string;
}

// response interface
export interface GeneralApiSaveResponse {
  message: string;
  status: string;
  calibration_run_id: number;
}

export interface GeneralErrorResponse {
  response_type: string;
  message: string;
  validation_errors?: ValidationErrorObject[];
}

export interface ValidationErrorObject {
  [key: string]: string;
}

export interface NonFieldError {
  non_field_errors: string[];
}
export interface GageBasinApiSavedResponse extends GeneralApiSaveResponse {
  geopackage_image_url?: string | null;
  eds_errors: edsError[];
}

export interface CreateRunValidationApiResponse extends GeneralApiSaveResponse {
  submit_date: Date;
  validation_run_id: number;
}

export interface edsError {
  name: string;
  message: string;
  status_code: string;
}

export interface FormulationTabSaveWarning {
  excluded_modules?: FormulationTabSaveWarningExcludedModule[];
  group_requirements?: FormulationTabSaveWarningGroupRequirement[];
  messages?: string[];
}

export interface FormulationTabSaveWarningExcludedModule {
  module_name?: string;
  must_have?: string[];
}

export interface FormulationTabSaveWarningGroupRequirement {
  group_name?: string;
  required_count?: number[];
  has_count?: number;
}

/**
 * model for calibration job list
 */
export interface CalibrationJobsList {
  jobs: CalibrationJobListItem[];
}

export interface CalibrationJobListItem {
  calibration_run_id: number;
  gage_id: string;
  job_genesis: string;
  created_at: Date;
  status: string;
  calibration_start_period: Date;
  calibration_end_period: Date;
  formulation_name: string;
  submit_date: Date;
  objective_function: string;
  optimization_algorithm: string;
  is_archived: boolean;
  validations: CalibrationJobValidationItem[];
  modules: string[];
}

/**
 * Interface to be used with CalibrationJobListItem
 */
export interface CalibrationJobValidationItem {
  validation_run_id: number;
  validation_type: string;
  status: string;
}

/**
 * model for validation job lists
 */
export interface ValidationJobsList {
  validation_jobs: ValidationJobListItem[];
}

export interface ValidationJobListItem {
  validation_run_id: number;
  submit_date: Date;
  validation_type: string;
  iteration_num: number;
  status: string;
  parameters: ValidationJobParameter[];
  best: boolean;
}

export interface ValidationJobParameter {
  name: string;
  value: number;
}

/**
 * module for user input calibration tab data
 */
export interface UserCalibrationRunData {
  calibration_run_id: number;
  submit_date: string; // e.g. "2024-09-13T05:50:22.334Z"
  gage: GageData;
  forcing_source: string;
  forcing_user_dir: string;
  forcing_dir_path: string;
  observational_source: string;
  observational_user_filename: string;
  observational_file_path: string;
  geopackage_source: string;
  external_data_status: ExternalDataStatus;
  geopackage_hydrofabric_file_path: string;
  geopackage_image_url: string;
  modules: string[];
  formulation_name: string;
  formulation_warning?: FormulationWarning;
  use_sloth: boolean;
  sloth_parameters: SlothParameterData[];
  automatic_validation: boolean;
  time_range: UserCalibrationRunTimeRangeData;
  calibration_times: UserCalibrationRunCalibrationTimesData;
  validation_times: UserCalibrationRunValidationTimesData;
  num_catchments: number | null;
  parameters_selected: boolean;
  parameters: UserCalibrationRunParametersData[];
  objective_function: string;
  streamflow_threshold: number;
  peak_flow_threshold: number;
  optimization: string;
  optimization_inputs: UserCalibrationRunOptimizationInputData[];
  save_plot_iteration_frequency: number;
  save_output_iteration: boolean;
  stop_criteria: number;
  status: string;
}

export interface FormulationWarning {
  exclude_modules: string[];
  group_requirements: GroupRequirements[];
  messages: string[];
}

export interface GroupRequirements {
  group_name: string;
  required_count: number[];
  has_count: number;
}
export interface ExternalDataStatus {
  observational: boolean;
  forcing: boolean;
  geopackage: boolean;
}

export interface UserCalibrationRunTimeRangeData {
  start_time: string;
  end_time: string;
}

export interface UserCalibrationRunCalibrationTimesData {
  calibration_start_time: string;
  calibration_end_time: string;
  simulation_start_time: string;
  simulation_end_time: string;
}

export interface UserCalibrationRunValidationTimesData {
  validation_start_time: string;
  validation_end_time: string;
  simulation_start_time: string;
  simulation_end_time: string;
}

export interface UserCalibrationRunParametersData {
  name: string;
  minimum: number;
  maximum: number;
  initial_value: number;
  module: string;
}

export interface UserCalibrationRunOptimizationInputData {
  name: string;
  value: number;
}

export interface SlothParameterData {
  param_name: string;
  param_count: number;
  param_type: string;
  param_units: string;
  param_location: string;
  param_value: number;
  maps_to_module: string;
  maps_to_variable_name: string;
}

/**
 * Model for Calibration's Headwater Basin Gage tab
 */
export interface GageTabData {
  status: string;
  calibration_run_id: number;
  forcing_source_values: ForcingSourceValueData[];
  observational_source_values: ObservationalSourceValueData[];
  geopackage_source_values: NameAndDescription[];
  gages: GageOptionData[];
  gage: GageData;
  geopackage_image_url: string;
  domain_values: DomainValueData[];
}

export interface GageOptionData {
  gage_id: string;
  nsw_id: string;
  domain: string;
  headwater_calibration: boolean;
}

export interface SaveGageTabPayload {
  calibration_run_id?: number;
  gage_id?: string;
  forcing_source?: string;
  observational_source?: string;
  geopackage_source?: string;
}

export interface GageData {
  gage_id: string;
  agency: string;
  station_name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface DomainValueData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface ForcingSourceValueData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface ObservationalSourceValueData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface NameAndDescription {
  name: string;
  description: string;
}

export interface SaveGageTabResponse extends GeneralApiSaveResponse {
  geopackage_image: string;
  eds_errors: edsError[];
  num_catchments: number | null;
}

/**
 * Model for Calibration's formulation tab
 */
export interface FormulationTabData {
  calibration_run_id: number;
  modules: FormulationModuleData[];
  module_groups: string[];
  status: string;
}

export interface FormulationModuleData {
  name: string;
  groups: string[];
  used_by_calibration_run: boolean;
}

export interface SaveFormulationTabPayload {
  calibration_run_id?: number;
  formulation_name?: string;
  modules?: string[];
  use_sloth?: boolean;
  sloth_parameters?: SlothParameterData[];
}

export interface tuning_load {
  calibration_run_id: number;
  status: string;
  modules: module_data[];
  calibration_times: {
    calibration_start_time: string;
    calibration_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  };
  validation_times: {
    validation_start_time: string;
    validatoin_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  };
}

export interface tuning_save {
  calibration_run_id: number;
  automatic_valiation: boolean;
  parameters: module_params[];
  calibration_times: {
    calibration_start_time: string;
    calibration_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  };
  validation_times: {
    validation_start_time: string;
    validatoin_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  };
}

/**
 * mode for misc UI input field
 */
export interface SelectOption {
  name: string;
  description: string;
  selected?: boolean;
  groups?: string[];
}

export interface module_data {
  name: string;
  groups: string[];
  parameters: module_params[];
}

export interface module_params {
  name: string;
  module: string;
  minimum: number;
  maximum: number;
  intial_value: 0;
}

export interface ModuleParameter {
  name: string;
  data_type: string;
  description: string;
  minimum: number;
  maximum: number;
  initial_value: number;
}

export interface SaveTuningTabParameter {
  name: string;
  minimum: number;
  maximum: number;
  initial_value: number;
  module: string;
}

export interface module_output {
  description: name_description_type[];
}

export interface name_description_type {
  name: string;
  description: string;
  data_type: string;
}

/**
 * Module for calibration's optimization tab
 */
export interface OptimizationTabData {
  calibration_run_id: number;
  status: string;
  metrics: OptimizationMetricData[];
  optimizations: OptimizationData[];
}

export interface OptimizationMetricData {
  name: string;
  description: string;
  is_active: boolean;
  categorical: boolean;
  event_based: boolean;
}

export interface OptimizationData {
  name: string;
  description: string;
  is_active: boolean;
  inputs: OptimizationDataInputData[];
}

export interface OptimizationDataInputData {
  name: string;
  description: string;
  data_type: string;
  is_active: boolean;
  default_value: number;
  min: number;
  max: number;
}

export interface SaveOptimizationPayload {
  calibration_run_id?: number;
  optimization_inputs?: UserCalibrationRunOptimizationInputData[];
  optimization?: string;
  objective_function?: string;
  streamflow_threshold?: number;
  peak_flow_threshold?: number;
  stop_criteria?: number;
  save_plot_iteration_frequency?: number;
  save_output_iteration?: boolean;
}

export interface CalibrationRun {
  runId: number;
  formulationName: string;
  headwaterBasinGage: string;
  runDate: string;
  calibrationPeriod: string;
  status: string;
}

export interface AlgorithmParameter {}

export interface CalibrationTuningData {}

/**
 * Model for Calibration Run Status tab
 */
export interface CalibrationRunStatusTabData {}

export interface CalibrationStatus {
  message: string;
  calibration_run_id: number;
  status: string;
  errors: string[];
  validations: Validations;
}

export interface Validations {
  validation_run_id: number;
  status: string;
  validation_type: string;
}

export interface CalibrationPlotListNamesData {
  calibration_run_id: number;
  plot_list: CalibrationPlotListData;
}

export interface CalibrationPlotListData extends SelectOption {
  filename: string;
}

/**
 * Evaluation models
 */
export interface ValidatedCalibrationRunListItem
  extends CalibrationJobListItem {
  objective_function: string;
  optimization_algorithm: string;
  validation_runs: number;
  validation_run_ids: number[];
}

export interface ValidatedCalibrationRunList {
  jobs: ValidatedCalibrationRunListItem[];
}

export interface CalibrationValidationRunData {
  validation_run_id: number;
  submit_date: Date;
  status: string;
  parameters: CalibrationValidationParameter[];
}

export interface CalibrationValidationJobList {
  validation_jobs: CalibrationValidationJobData[];
}

export interface CalibrationValidationJobData
  extends CalibrationValidationRunData {
  iteration_num: number;
  best?: boolean;
}

export interface CalibrationValidationParameter {
  name: string;
  value: number;
}

export interface DynamicTableColumnHeader {
  header: string;
  colspan: number;
  field?: string;
  styles?: string[];
}

export interface DynamicTableColumn {
  field: any;
  header?: string;
  hidden?: boolean;
  styles?: string[];
}

export interface CalibrationRunByIteration {
  message: string;
  objective_function_metric: string;
  iteration_data: CalibrationRunIterationData[];
  retrospective_data: CalibrationRunByIterationRetrospectiveData[];
}

export interface CalibrationRunIterationData {
  iteration_num: number;
  iteration_id: number;
  validation_run_id?: number;
  worker_name: string;
  best_params: boolean;
  objective_function_value: number;
  parameters: CalibrationRunIterationParameterData[];
  metrics: CalibrationRunIterationMetricData[];
}

export interface CalibrationRunIterationParameterData {
  parameter_name: string;
  parameter_value: number;
}

export interface CalibrationRunValidationParameterData {
  name: string;
  value: number;
}

export interface CalibrationRunByIterationRetrospectiveData {
  name: string;
  data: CalibrationRunIterationMetricData[];
}

export interface CalibrationRunIterationMetricData {
  metric_name: string;
  metric_value: number;
}

export interface AlternativeIterationCalibrationRunData {
  iteration_id: number;
  validation_run_id: number | string;
  worker_name: string;
  iteration_num: number;
  objective_function_value: number;
  [name: string]: string | number;
}

export interface AlternativeIterationTuningParameters {
  iteration_id: number;
  validation_run_id: number | string;
  worker_name: string;
  iteration_num: number;

  [name: string]: string | number;
}

export interface APIResponse {
  _data?: { [key: string]: any };
}

export interface DynamicObject {
  [key: string]: any;
}

export interface CalibrationGetStatusResponse {
  message: string;
  calibration_run_id: number;
  status: string;
  errors?: string[];
  validations: CalibrationGetStatusValidationItem[];
  submit_date: Date;
  elapsed_time: string | null;
  performance_metrics: CalibrationGetStatusPerformanceMetricItem[] | null;
}

export interface CalibrationGetStatusValidationItem {
  validation_run_id: number;
  iteration_num: number;
  status: string;
  validation_type: string;
  submit_date: Date;
  run_end: Date;
  run_start: Date;
  elapsed_time?: string | null;
  performance_metrics?: CalibrationGetStatusPerformanceMetricItem[] | null;
}

export interface CalibrationGetStatusPerformanceMetricItem {
  elapsed_time: string;
  num_cpus: number;
  cpu_time: string;
  max_rss: string;
  max_disk_read: string;
  max_disk_write: string;
  reserved_time: string;
}

/**
 * context menu option types
 */
export interface DataTableContextMenuOption {
  label: string;
  icon: string;
  command: any;
}

/**
 * Event Bus Interface
 */
export type LogoutEvent = {
  logoutEvent: string;
};

export type AccountEvent = {
  accountEvent: string;
  aboutBoxEvent: string;
  errorLogEvent: string;
};

export type CombinedVersionInfo = {
  version: string;
  date: string;
  contact_email: string;
  commit_hash: string;
  ngenCerf_version: string;
  ngenCerf_date: string;
  ngenCerf_copyright: string;
};

export type ForecastCycle = {
  name: string;
  data_sources: string;
  time_range: string;
  is_active: boolean;
};

export type CalibrationRunsForForecast = CalibrationRunForForecast[];

export type CalibrationRunForForecast = {
  calibration_run_id: number;
  gage_id: string;
  job_genesis: string;
  created_at: string;
  status: string;
  calibration_start_period: string;
  calibration_end_period: string;
  formulation_name: string;
  submit_date: string;
  objective_function: string;
  optimization_algorithm: string;
  validations: CalibrationJobValidationItem[];
};

export interface ForecastJob {
  calibration_run_id: number;
  forecast_run_id: number;
  cycle: string;
  gage_id: string;
  forecast_status: string;
  forcing_download_status: string;
  submit_date: string;
}

export type ForecastJobs = {
  forecast_jobs: ForecastJob[];
}

export const ValidationFormFields = {
  formulation_name: "Formulation Name",
  modules: "Formulation Modules",
  sloth_parameters: "Sloth Parameters",
  maps_to_module: "Sloth Parameter For Module",
  maps_to_variable_name: "Sloth Parameter Module Param",
  param_type: "Sloth Parameter Type",
  param_units: "Sloth Parameter Units",
  stop_criteria: "Stop Criteria",
  save_plot_iteration_frequency: "Plot Generation Frequency",
  streamflow_threshold: "Flow Threshold",
  peak_flow_threshold: "Peak Flow Threshold",
  objective_function: "Objective Function",
  optimization: "Optimization Algorithm",
};

export type PlotNames = {
  calibration_run_id: number;
  plot_names: NameAndDescription[];
  status: string;
};

export type GageResetData = {
  external_data_status: {
    observational: boolean;
    forcing: boolean;
    geopackage: boolean;
  };
  geopackage_source: string;
  observational_source: string;
  forcing_source: string;
  geopackage_image_url: string;
}

export type BestIterationData = {
  iteration: number;
  isBest: boolean;
}

export interface ToastRecord extends ToastMessageOptions {
  datetime: string;
}

export type StatusRecord = {
  status: string;
  filterValue: string;
}

export type FilterTimeRange = {
  earliest: Date;
  latest: Date;
}

export type ServerStatus = {
  status: number;
  ok: boolean;
}

export interface GitData {
  release: string;
  build_date: string;
  commit_hash: string;
  commit_date: string;
  author: string;
  message: string;
}

