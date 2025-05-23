<template>
  <client-only>
    <div class="h-full min-h-screen ">
      <div class="grid grid-rows-12">
        <div class="row-span-1">
          <div>
            <AppHeader />
          </div>
        </div>
        <div class="grid row-span-10">
          <div class="grid grid-rows-12">
            <div class="row-span-12 flex items-center justify-center h-screen-inner">

              <div id="LoginBox" class="bg-white mx-auto px-12 py-12 rounded-[10px] max-w-screen-md"
                :class="!showDialog ? 'loginBox' : 'createAccountBox'">

                <div v-if="!showDialog" class="mx-auto px-8 text-left">
                  <form onsubmit="return false">

                    <h1>Login</h1>

                    <div class="mt-10">
                      <label for="uname" style="font-weight: normal;">Email</label><br>
                      <input id="uname" class="w-[350px]" type="text" v-model="userName" placeholder=" Email"
                        aria-label="Username" autocomplete="email" v-on:keypress="autoSubmit" />
                      <!-- <Button tabindex="-1" class="c-blue underline text-xs" v-on:click="ForgotUsername">
                        Forgot Email
                      </Button> -->
                    </div>
                    <div class="mt-4">
                      <label for="pword" style="font-weight: normal;">Password</label><br>
                      <Password id="pword" type="password" autocomplete="current-password" v-model="userPassword"
                        placeholder=" Password" aria-label="Password" toggleMask :feedback="false"
                        class="block w-[350px]" v-on:keypress="autoSubmit" />
                      <Button tabindex="-1" class="c-blue underline text-xs" v-on:click="ForgotPassword">
                        Forgot Password
                      </Button>
                    </div>

                    <Button id="LoginButton" class="ngenButtonDiv btn-left mt-4" v-on:click="SubmitLoginForm"
                      aria-label="sign in">Sign In</Button>

                    <div class="signupButton underline text-base mt-2" aria-label="sign up">
                      <Button @click="openDialog" class="c-blue">Create an Account</Button>
                    </div>

                  </form>
                </div>

                <div v-if="showDialog">
                  <div class="dialog-overlay" @click.self="closeDialog">
                    <div class="dialog-content">
                      <h1>Create an Account</h1>
                      <form @submit.prevent="SubmitNewAccountForm">
                        <div class="form-group inputBox">
                          <label for="email">Email</label>
                          <InputText v-model="newEmail" id="email" type="email" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="first_name">First Name</label>
                          <InputText v-model="newFirstName" id="first_name" type="text" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="last_name">Last Name</label>
                          <InputText v-model="newLastName" id="last_name" type="text" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="password">Password</label>
                          <Password v-model="newPassword" id="password" type="password" name="password"
                            autocomplete="current-password" required toggleMask class="block">
                            <template #header>
                              <div class="font-semibold text-xm mb-4">Password</div>
                            </template>
                            <template #footer>
                              <Divider />
                              <ul class="pl-2 ml-2 my-0 leading-normal">
                                <li>Cannot be a commonly used password</li>
                                <li>Must be at least 8 characters long</li>
                                <li>Must contain at least one non-numeric character</li>
                              </ul>
                            </template>
                          </Password>
                        </div>
                        <div class="form-group inputBox">
                          <label for="confirmPassword">Confirm Password</label>
                          <Password v-model="confirmPassword" id="confirmPassword" type="password" :feedback="false"
                            required toggleMask class="block" />
                        </div>
                        <div :class="createAccountButtonClasses">
                          <Button type="submit" :disabled="disableCreateAccountBtn">Create Account</Button>
                        </div>
                        <div class="signupButton underline text-base inline pl-6">
                          <Button @click="closeDialog" :class="cancelCreateAccountLinkClasses"
                            :disabled="disableCreateAccountBtn">Cancel</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import AppFooter from "@/components/Common/AppFooter.vue";
import AppHeader from "@/components/Common/AppHeader.vue";

import { useBackendConfig } from "@/composables/UseBackendConfig";

const { serverInfo, gitInfo } = storeToRefs(generalStore());

const { popupActive } = storeToRefs(generalStore());

const { calibrationJobId } = storeToRefs(generalStore());

const { logUserIn, setUserName, hardResetUserDataStore, isUserLoggedIn, getAccessToken } = useUserDataStore();
const { resetGeneralStore, clearToastRecords, addToastRecord, getServerInfo, setServerInfo } = generalStore();

const { ngencerfBaseUrl } = useBackendConfig();

const toast = useToast();
const userDataStore = useUserDataStore();
const userName = ref<string>("");
const userPassword = ref<string>("");
const showDialog = ref(false);

const newEmail = ref('');
const newFirstName = ref('');
const newLastName = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const disableCreateAccountBtn = ref<boolean>(false);
const createAccountButtonClasses = ref<string[]>(["ngenButtonDiv", "btn-left", "mt-4"]);
const cancelCreateAccountLinkClasses = ref<string[]>(['c-blue'])

onMounted(() => {
  popupActive.value = false;
  nextTick(async () => {
    sessionStorage.clear();
    localStorage.clear();
    clearToastRecords();
    calibrationJobId.value = 0;
    hardResetUserDataStore();
    resetGeneralStore();
    await getFooterInformation();
  });
});


// Get footer infongenCERF
const getFooterInformation = () => {
  makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/get_footer`, {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": 'application/json'
    },
    body: ""
  }).then((result) => {
    serverInfo.value = result;
    if (serverInfo.value) {
      setServerInfo(serverInfo.value);
    }
  })
}

// Get footer infongenCERF
const getGitInformation = () => {
  makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/get_git_info/`, {
    method: "POST",
    mode: 'cors',
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`,
      "Content-Type": 'application/json'
    },
    body: ""
  }).then((result) => {
    gitInfo.value = result._data.git_info;
  })
}

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const ForgotUsername = () => {
  //
};

const ForgotPassword = () => {
  const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Info', detail: 'Please contact the ngenCERF administrator to reset your password.' };
  toast.add(tMsg); addToastRecord(tMsg);
};

const autoSubmit = (e: KeyboardEvent) => {
  if (e.key === "Enter" && (userName.value.trim() !== "" && userPassword.value.trim() !== "")) {
    SubmitLoginForm(e);
  }
}

/** 
 * Submits the login form
 * @param e - event object
 */
const SubmitLoginForm = async (e: Event) => {
  e.preventDefault(); // prevents the page from reloading

  if (userName.value.trim() !== "" && userPassword.value.trim() !== "") {
    // try to create new access and refresh tokens

    await $fetch<any>(`${ngencerfBaseUrl}/auth/jwt/create/`, {
      method: 'POST',
      mode: 'cors',
      body: {
        email: userName.value.toLowerCase(),
        password: userPassword.value
      }
    }).then(response => {
      setUserName(userName.value.toLowerCase());
      // store tokens in UserDataStore
      userDataStore.setAccessToken(response.access);
      userDataStore.setRefreshToken(response.refresh);
      // store user name in UserDataStore
      userDataStore.setFirstName(response.first_name);
      userDataStore.setLastName(response.last_name);
      GetExternalInfo();
      logUserIn();
      GoToLanding();
    }
    ).catch(error => {
      if (error) {
        let err = error.data?.detail;
        if (!err) {
          err = "Cannot reach server. Error code: " + error.statusCode;
        }
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: err, life: ToastTimeout.timeout3000 };
        toast.add(tMsg); addToastRecord(tMsg);
        console.error("Error during user creation:", error.message, error.data.detail);
      }
    });
  } else if (userName.value.trim() === "" || userPassword.value.trim() === "") {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: "A Username and Password are required", life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const GetExternalInfo = async () => {
  await getGitInformation();
  serverInfo.value = getServerInfo();
}


const SubmitNewAccountForm = async () => {
  if (newPassword.value !== confirmPassword.value) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Passwords do not match.', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
    return;
  }

  disableCreateAccountBtn.value = true;
  if (!createAccountButtonClasses.value.includes('disabledButton')) createAccountButtonClasses.value.push('disabledButton');
  if (!cancelCreateAccountLinkClasses.value.includes('disabledLink')) cancelCreateAccountLinkClasses.value.push('disabledLink');

  //try to create a new account for user
  const { data, error, } = await useFetch<any>(`${ngencerfBaseUrl}/auth/users/`, {
    method: 'POST',
    mode: 'cors',
    body: {
      email: newEmail.value.toLowerCase(),
      first_name: newFirstName.value,
      last_name: newLastName.value,
      password: newPassword.value,
      re_password: confirmPassword.value
    }
  });

  if (error.value) {
    disableCreateAccountBtn.value = false;
    createAccountButtonClasses.value.splice(createAccountButtonClasses.value.indexOf('disabledButton'), 1);
    cancelCreateAccountLinkClasses.value.splice(cancelCreateAccountLinkClasses.value.indexOf('disabledLink'), 1);
    if (error.value?.data.email) {
      let detail = error.value?.data.email[0];
      if (detail.indexOf('already exists')) {
        // customize error message since the one we get back from Djoser isn't ideal
        detail = 'A user with this Email address has already registered.'
      }
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: detail, life: ToastTimeout.timeout3000 };
      toast.add(tMsg); addToastRecord(tMsg);
      return;
    } else if (error.value?.data.first_name) {
      let detail = error.value?.data.first_name[0];
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: detail, life: ToastTimeout.timeout3000 };
      toast.add(tMsg); addToastRecord(tMsg);
      return;
    } else if (error.value?.data.last_name) {
      let detail = error.value?.data.last_name[0];
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: detail, life: ToastTimeout.timeout3000 };
      toast.add(tMsg); addToastRecord(tMsg);
      return;
    } else if (error.value?.data.password) {
      error.value?.data.password.forEach((e: any) => {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: e, life: ToastTimeout.timeout3000 }
        toast.add(tMsg); addToastRecord(tMsg);
      });
      return;
    }
  }

  if (data.value.email && data.value.id) {
    disableCreateAccountBtn.value = false;
    createAccountButtonClasses.value.splice(createAccountButtonClasses.value.indexOf('disabledButton'), 1);
    cancelCreateAccountLinkClasses.value.splice(cancelCreateAccountLinkClasses.value.indexOf('disabledLink'), 1);
    const tMsg: ToastMessageOptions = { severity: 'success', summary: 'Success', detail: 'Account created successfully. Please log in.', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
    closeDialog();
  };
};

/**
 * Navigates to the landing page.
 */
const GoToLanding = () => {
  navigateTo("LandingPage");
};

</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

.needAccount {
  font-size: 18px;
  font-weight: 600;
  margin-top: 50px;
}

.signupButton {
  border: 0px;
  margin: 20px auto 0 0;
}

.ngenButtonDiv.disabledButton {
  background-color: darkgray;
}

.disabledLink {
  color: darkgray;
}

.c-blue:hover {
  background-color: transparent;
  font-weight: bold;
  border: none;
}
</style>
