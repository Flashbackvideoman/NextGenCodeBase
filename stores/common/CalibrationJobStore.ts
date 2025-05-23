// @ts-check

import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "#imports";
import type { CalibrationJobListItem } from "@/composables/NextGenModel";

export const useCalibrationJobStore = defineStore( 'CalibrationJobStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore()
  const { userCalibrationJobsListData } = storeToRefs( useUserDataStore() )
  const { calibrationJobId } = storeToRefs( generalStore() )

  /**
 * returns list of calibration job data from server
 * @returns {CalibrationJobListItem[]}
 */
  const fetchJobsListData = computed( () => {
    return userCalibrationJobsListData.value ?? []
  })

  /**
 * based on the current user's list of calibration job return number of job with status of "saved"
 * @returns {number}
 */
  const savedCalibrationJobs = computed( () => {
    return userCalibrationJobsListData.value?.reduce( ( total_saved_jobs: number, job: CalibrationJobListItem  ) => {
        if( job.status.toLowerCase() === 'saved' ) total_saved_jobs += 1;
        return total_saved_jobs;
    }, 0 )
  })

  /**
 * based on the current user's list of calibration job return number of job with status of "running"
 * @returns {number}
 */
  const runningCalibrationJobs = computed( () => {
    return userCalibrationJobsListData.value?.reduce( ( total_running_jobs: number, job: CalibrationJobListItem  ) => {
        if( job.status.toLowerCase() === 'running' ) total_running_jobs += 1;
        return total_running_jobs;
    }, 0 )
  })

  /**
 * return a new calibration run id generated from the server
 * @returns {CreatedCalibrationRun}
 */
  async function fetchNewCalibrationRunId() {
    return await makeProtectedApiCall<CreatedCalibrationRun>( `${ngencerfBaseUrl}/calibration/create_calibration_run/`, {
        method: "POST",
        mode: 'cors',
        headers: { 
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": 'application/json'
        }
    } );
  }


  /**
  * Delete a job
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function deleteCalibrationRun(runIds: any) {
    let toDelete: number[];
    if( !Array.isArray(runIds) ) {
      toDelete = [runIds];
    } else {
      toDelete = runIds;
    }
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/delete_jobs/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_ids: toDelete })
    })
  }

  /**
  * Archive or Un-archive a job
  * If unarchive, set unArchive to true
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function archiveCalibrationRun(runIds: any, unArchive:  boolean) {
        let toDelete: number[];
    if( !Array.isArray(runIds) ) {
      toDelete = [runIds];
    } else {
      toDelete = runIds;
    }
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/archive_jobs/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_ids: toDelete, archive: unArchive })
    })
  }

  /**
 * Clone a job
 */
  async function cloneCalibrationRun(runId: number) {
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/clone_job/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: runId })
    })
  }

  return {
    fetchJobsListData,
    calibrationJobId,
    savedCalibrationJobs,
    runningCalibrationJobs,
    fetchNewCalibrationRunId,
    cloneCalibrationRun,
    deleteCalibrationRun,
    archiveCalibrationRun
  }
},
{
    persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationJobStore, import.meta.hot));
}