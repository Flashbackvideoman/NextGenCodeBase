/**
 * This composable contains the server configuration for the backend API
 */

import { useRuntimeConfig } from "#app";

export const useBackendConfig = () => {
  const ngencerfBaseUrl = "http://localhost:8000"; //useRuntimeConfig().public;

  return {
    ngencerfBaseUrl
  };
}
