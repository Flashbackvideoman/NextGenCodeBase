// @ts-check

import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { makeProtectedApiCall } from "@/composables/UserAuth";

import type {
  SelectOption,
  GageTabData,
  GeneralApiSaveResponse,
  GeneralErrorResponse,
  SaveGageTabResponse,
  SaveGageTabPayload,
} from "@/composables/NextGenModel";

export const useGageStore = defineStore(
  "GageStore",
  () => {
    /**
     * ref section
     */
    const { calibrationJobId } = storeToRefs(generalStore());
    const { ngencerfBaseUrl } = useBackendConfig();
    const { getAccessToken } = useUserDataStore();
    const userDataStore = useUserDataStore();
    const { userCalibrationRunData } = storeToRefs(userDataStore);

    const domainOptionsList = ref<SelectOption[]>([]);
    const gageOptionsList = ref<SelectOption[]>([]);
    const isNWMv3 = ref<boolean>(false);

    const gageTabData = ref<GageTabData>();
    const geopackageImageUrl = ref<string>("");
    const selectedDomainValue = ref<string>("");
    const selectedGageValue = ref<string>("");
    const selectedForcingValue = ref<string>("");
    const selectedObservationalValue = ref<string>("");
    const selectedGeopackageValue = ref<string>("");
    const gageData = ref<GageData>();

    const gageStore_data_loading = ref<boolean>(true);

    const gagePayload = ref(<SaveGageTabPayload>{});

    const loadGageTabStaticData = () => {
      gageStore_data_loading.value = true;
      makeProtectedApiCall<GageTabData>(
        `${ngencerfBaseUrl}/calibration/load_gage_tab/`,
        {
          method: "POST",
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calibration_run_id: calibrationJobId.value }),
        }
      ).then((gageTabDataResult) => {
        gageTabData.value = gageTabDataResult?._data ?? undefined;
        gageStore_data_loading.value = false;
        //init ui model value
        geopackageImageUrl.value =
          userCalibrationRunData.value?.geopackage_image_url ?? "";
        setUserSelection();
      });
    };
    /**
     * get iser se;ected domain name based on the selected gage
     * @returns {string}
     */
    const getSavedDomainValue = computed(() => {
      if (
        userCalibrationRunData.value?.gage === undefined ||
        userCalibrationRunData.value?.gage?.gage_id === ""
      ) {
        return "";
      } else {
        let selected_gage_item = gageTabData.value?.gages.find(
          (gage_item) =>
            gage_item.gage_id === userCalibrationRunData.value?.gage?.gage_id
        );
        return selected_gage_item?.domain;
      }
    });

    /**
     * return list of domain options for Select input
     * @returns {SelectOption[]}
     */
    const getDomainOptionsList = computed(() => {
      domainOptionsList.value = [];
      if (gageTabData?.value?.domain_values.length) {
        gageTabData.value?.domain_values.forEach((domain_value) => {
          domainOptionsList.value.push({
            name: domain_value.name,
            description: domain_value.description,
            selected: false,
            groups: [],
          });
        });
      }
      return domainOptionsList.value;
    });

    /**
     * generate list of gage option for Select input based on the domain value and nwm_v3 filter
     * @returns {SelectOption[]}
     */
    const getGageOptionsList = computed(() => {
      gageOptionsList.value = [];
      gageTabData.value?.gages.forEach((gage_value) => {
        if (
          selectedDomainValue.value === "" ||
          gage_value.domain === selectedDomainValue.value
        ) {
          if (gage_value.headwater_calibration) {
            gageOptionsList.value.push({
              name: gage_value.gage_id,
              description: gage_value.gage_id,
              selected: false,
              groups: [],
            });
          }
        }
      });

      return gageOptionsList.value;
    });

    const getForcingOptionsList = computed(() => {
      return gageTabData.value?.forcing_source_values;
    });

    const getObservationalOptionsList = computed(() => {
      return gageTabData.value?.observational_source_values;
    });

    const getGeopackageOptionsList = computed(() => {
      return gageTabData.value?.geopackage_source_values;
    });

    /**
     *  fetch gage data based on the selected gage value
     *  @returns {void}
     */
    async function fetchSelectedGageData(): Promise<void> {
      const selectedGageDataResponse = await makeProtectedApiCall<GageData>(
        `${ngencerfBaseUrl}/calibration/get_gage/`,
        {
          method: "POST",
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gage_id: selectedGageValue.value,
          }),
        }
      );
      gageData.value = selectedGageDataResponse?._data ?? undefined;
    }

    /**
     * return saving gage tab response from the server
     * @returns {SaveGageTabResponse}
     */
    async function saveGageTabData() {
      if (selectedGageValue.value)
        gagePayload.value["gage_id"] = selectedGageValue.value;
      if (selectedForcingValue.value)
        gagePayload.value["forcing_source"] = selectedForcingValue.value;
      if (selectedObservationalValue.value)
        gagePayload.value["observational_source"] = selectedObservationalValue.value;
      if (selectedGeopackageValue.value)
        gagePayload.value["geopackage_source"] = selectedGeopackageValue.value;

      if (
        Object.keys(gagePayload.value).length > 0 &&
        gagePayload.value.hasOwnProperty("gage_id")
      ) {
        gagePayload.value["calibration_run_id"] = calibrationJobId.value;

        const saveGageTabDataResponse =
          await makeProtectedApiCall<SaveGageTabResponse>(
            `${ngencerfBaseUrl}/calibration/save_gage_tab/`,
            {
              method: "POST",
              mode: 'cors',
              headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(gagePayload.value),
            }
          );

        geopackageImageUrl.value = saveGageTabDataResponse?._data?.geopackage_image_url ?? "";

        return saveGageTabDataResponse;
      } else {
        return Promise.resolve({
          _data: {
            message: "Please select a Gage ID before saving.",
            calibration_run_id: calibrationJobId.value,
            status: "error",
          },
          status: 400,
        });
      }
    }

    /**
     *
     * @param formData
     * @returns {GeneralApiSaveResponse | GeneralErrorResponse}
     */
    async function saveUserForcingFiles(formData: FormData) {
      const saveUserForcingFilesResponse = await makeProtectedApiCall<
        GeneralApiSaveResponse | GeneralErrorResponse
      >(`${ngencerfBaseUrl}/calibration/upload_forcing_data/`, {
        method: "POST",
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: formData,
      });

      return saveUserForcingFilesResponse;
    }

    /**
     *
     * @param formData
     * @returns {GeneralApiSaveResponse | GeneralErrorResponse}
     */
    async function saveUserObservationalFile(formData: FormData) {
      const saveUserObservationalFilesResponse = await makeProtectedApiCall<
        GeneralApiSaveResponse | GeneralErrorResponse
      >(`${ngencerfBaseUrl}/calibration/upload_observational_data/`, {
        method: "POST",
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: formData,
      });

      return saveUserObservationalFilesResponse;
    }

    async function saveUserGeopackageFile(formData: FormData) {
      formData.append("return_geopackage_url", String(true));
      const saveUserGeopackageFilesResponse = await makeProtectedApiCall<
        GeneralApiSaveResponse | GeneralErrorResponse
      >(`${ngencerfBaseUrl}/calibration/upload_geopackage_data/`, {
        method: "POST",
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: formData,
      });

      return saveUserGeopackageFilesResponse;
    }

    /**
     * private function for setting ui reactive field
     * @returns {void}
     */
    const setUserSelection = (): void => {
      selectedDomainValue.value = getSavedDomainValue.value ?? ""
      selectedGageValue.value = userCalibrationRunData.value?.gage?.gage_id ?? ""
      selectedForcingValue.value =  !userCalibrationRunData.value?.external_data_status.observational && getForcingOptionsList.value ? getForcingOptionsList.value[0].name : "";
      selectedObservationalValue.value = !userCalibrationRunData.value?.external_data_status.forcing && getObservationalOptionsList.value ? getObservationalOptionsList.value [0].name : "";
      selectedGeopackageValue.value = !userCalibrationRunData.value?.external_data_status.geopackage && getGeopackageOptionsList.value ? getGeopackageOptionsList.value[0].name : "";
      gageData.value = userCalibrationRunData.value?.gage ?? undefined
    }
    /**
     * @returns {void}
     */
    const resetUserSelectionGage = (): void => {
      if (userCalibrationRunData.value?.gage) {
        setUserSelection();
      } else {
        resetGageStore();
      }
    };

    useLogoutListen("logoutEvent", (evStr: string) => {
      if (evStr === "logout") {
        resetGageStore();
      }
    });

    /**
     * @returns {void}
     */
    const resetGageStore = (): void => {
      selectedDomainValue.value = "";
      selectedForcingValue.value = "";
      selectedGageValue.value = "";
      selectedObservationalValue.value = "";
      selectedGeopackageValue.value = "";
      gageData.value = undefined;
      geopackageImageUrl.value = "";
    };

    return {
      selectedDomainValue,
      selectedForcingValue,
      selectedGageValue,
      selectedObservationalValue,
      getSavedDomainValue,
      selectedGeopackageValue,
      gageTabData,
      getDomainOptionsList,
      getGageOptionsList,
      getForcingOptionsList,
      getObservationalOptionsList,
      getGeopackageOptionsList,
      saveGageTabData,
      isNWMv3,
      fetchSelectedGageData,
      gageData,
      gageStore_data_loading,
      geopackageImageUrl,
      userCalibrationRunData,
      resetUserSelectionGage,
      saveUserForcingFiles,
      saveUserObservationalFile,
      saveUserGeopackageFile,
      resetGageStore,
      loadGageTabStaticData,
      gagePayload
    };
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGageStore, import.meta.hot));
}
