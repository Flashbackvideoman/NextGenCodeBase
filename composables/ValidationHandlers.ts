import { ref } from "vue"
import type { ToastMessageOptions } from "primevue/toast";

import type { SlothParameterData, SaveFormulationTabPayload, FormulationTabSaveWarning, GageBasinApiSavedResponse, edsError } from "./NextGenModel";

import { ValidationFormFields } from "./NextGenModel";

/**
 * @param requiredFields 
 * @returns Object{'field_name':[<string>message]}
 */
export const useCalibrationTabValidation = ( requiredFields: any ) => {
  const errors = ref<any>({})

  Object.keys( requiredFields ).forEach( key => {
    let failed = false
    if ( typeof requiredFields[ key ] === "string" ) {
        if ( requiredFields[ key ] === "" ) failed = true
    } else if ( Array.isArray( requiredFields[ key ] ) ) {
        if ( requiredFields[ key ].length === 0 ) failed = true
    }
    if ( failed ) {
        errors.value[ key as keyof typeof errors] = ['field is required.']
    }
  });

  return {
    errors
  }
}

/**
 * 
 * @param savedResponse 
 * @returns {ToastMessageOptions[]}
 */
export const useProcessCalibrationGageSavedResponse = ( savedResponse: GageBasinApiSavedResponse ) => {
  const messages = ref<ToastMessageOptions[]>([]);
  messages.value.push({
    severity: 'success',
    summary: `Gage Data Saved`, 
    detail: savedResponse.message, 
    life: ToastTimeout.timeout5000 
  });

  if ( savedResponse.hasOwnProperty( 'eds_errors' ) && savedResponse.eds_errors.length > 0 ) {
    savedResponse.eds_errors.forEach( ( eds_error : edsError ) => {
      messages.value.push({
        severity: 'warn',
        summary: 'EDS Error',
        detail: eds_error.message,
        life: ToastTimeout.timeout10000
      });
    })
  }

  return messages.value;
}

/**
 * @param SlothParameterData[] 
 * @returns [<string>messages]
 */
export const useCalibrationFormulationSlothTableValidation = ( slothParameters: SlothParameterData[] ) => {
  const BreakException = {};
  const errors = ref<any>({});
  
  try {
    slothParameters.forEach( ( slothParameter ) => {
        Object.keys( slothParameter ).forEach( key => {
          if ( slothParameter[ key as keyof SlothParameterData ] === "" ) {
              throw new Error( key )
          }
        })
    });
  } catch ( error: any ) {
    errors.value[ error?.message as keyof typeof errors ] = [ 'All sloth parameter fields are required.' ];
  }  
  return errors;
}

export const useCalibrationFormulationTabSaveValidate = ( savePayload: SaveFormulationTabPayload ) => {
  const errors = ref<any>({});
  if ( (document.getElementById('formulationNameInput') as HTMLInputElement).value === "") {
    errors.value[ 'formulation_name' ]= [ ' is empty. Please enter a required Formlulation Name' ];
    document.getElementById('formulationNameInput')?.focus();
  } else if ( savePayload.hasOwnProperty( "formulation_name" ) && /^[a-z0-9-_]+$/i.test( savePayload['formulation_name'] ?? "" ) === false ) {
    errors.value[ 'formulation_name' ]= [ ' can only include alpha numeric charaters and underscore.' ];
  }

  if ( savePayload.hasOwnProperty( "sloth_parameters" ) && !savePayload.hasOwnProperty( "modules" ) ) {
    errors.value[ 'selectedModuleValues' ]= [ 'Selecting module is required for Sloth Parameter.' ];
  }
  if ( savePayload.hasOwnProperty( "sloth_parameters" ) && savePayload.hasOwnProperty( "modules" ) ) {
    const slothParametersValidation = useCalibrationFormulationSlothTableValidation( savePayload['sloth_parameters'] ?? [] );
    for (const [ key, messages ] of Object.entries( slothParametersValidation.value  )) {
        errors.value[ `${key}` ] = messages;
      }  
  }

  return errors;
}

export const useCalibrationFormulationTabSaveWarning = ( formulation_warning: FormulationTabSaveWarning ) => {
  let warnings = <string[]>[];
  
  if ( formulation_warning.hasOwnProperty( "messages") && Array.isArray( formulation_warning.messages ) && formulation_warning.messages.length > 0 ) {
    warnings = formulation_warning.messages;
  }

  return warnings;
}

/**
 * @param validationErrors 
 * @returns [<string>messages]
 */
export const useApiErrorResponseValidator = ( validationErrors: any ) => {
  let errors = <string[]>[];
  Object.keys( validationErrors ).forEach( key => {
    let field_label = key;
    if ( key in ValidationFormFields ) field_label = ValidationFormFields[ key as keyof typeof ValidationFormFields ];
    validationErrors[ key ].forEach( ( validation_error: any ) => {
        if ( typeof validation_error === "string" ) {
          errors.push( `${field_label} ${validation_error}`);
        }
        if ( typeof validation_error === "object" ) {
          let error_messages = useApiErrorResponseValidator( validation_error );
          errors = errors.concat( error_messages );
        }
    })
  })
  return errors;
}

export const useApiErrorResponsePreprocess = ( errorResponse: any ) => {
  let errors = <string[]>[];
  if ( errorResponse?._data?.validation_errors ) {
    errors = useApiErrorResponseValidator( errorResponse?._data?.validation_errors );
  }
  if ( errorResponse?._data?.error && typeof errorResponse?._data?.error === 'string' &&  errorResponse?._data?.error.length > 0 ) {
    errors.push( errorResponse?._data?.error );
  }
  if ( errorResponse?._data?.message && typeof errorResponse?._data?.message === 'string' &&  errorResponse?._data?.message.length > 0 ) {
    errors.push( errorResponse?._data?.message );
  }
  return errors;
}

export const useApiResponseToastSeverityCode = ( status: number ) => {
  switch ( status ) {
    case 200:
      return "success";
    case 400:
    case 500:
      return "error";
    default:
      return "warn";
  }
}