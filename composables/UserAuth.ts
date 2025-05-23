/**
 * This Composable contains utility functions for user authentication and making JWT-based API calls
 */

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useLogout } from "@/composables/UseEventBus";

import { generalStore } from "@/stores/common/GeneralStore";

/**
 * Refreshes access token
 * @param ngencerfBaseUrl
 * @returns {boolean} true if access token is refreshed successfully, false otherwise
 */
export const refreshAccessToken = async ( ngencerfBaseUrl: string) => {
  const userDataStore = useUserDataStore();
  const refreshToken = userDataStore.getRefreshToken();
  // If no refresh token is present, return false
  if (!refreshToken) {
    return false;
  }

  try {
    // Make a request to server to refresh the access token
    const data = await $fetch<any>(`${ngencerfBaseUrl}/auth/jwt/refresh/`, {
      method: "POST",
      body: { refresh: refreshToken },
    });
    const { access } = data;

    // If new access token is returned, update user data store with new access token
    if (access) {
      userDataStore.setAccessToken(access);
      return true;
    } else {
      console.error("Token refresh failed");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

/**
 * This function makes a protected-API call to the server
 * @param url
 * @param userOptions
 * @returns response from the API call
 */
export async function makeProtectedApiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T | string; status: number; ok: boolean }> {
  // If the body is a plain object (and not an instance of FormData), stringify it.
  if (
    options.body &&
    typeof options.body === "object" &&
    !Array.isArray(options.body) &&
    !(options.body instanceof FormData)
  ) {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, options); 
  const contentType = response.headers.get("content-type") || "";

  // Parse as JSON if the response has a JSON content type; otherwise, return text.
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return data;
}

const sendUserToLogin = () => {
  const userDataStore = useUserDataStore();
  userDataStore.logUserOut();
  useLogout("logoutEvent", "token");
  return null;
};
