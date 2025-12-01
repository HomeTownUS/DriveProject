<template>
  <div class="auth-view">
    <VApp>
      <VMain>
        <VContainer
          class="d-flex align-center justify-center"
          style="min-height: 75vh"
        >
          <VCard max-width="480" class="pa-4" color="cardColor">
            <VCardTitle>Sign In</VCardTitle>
            <VCardText>
              <VForm ref="formRef" @submit.prevent="submit">
                <VTextField
                  class="w-100"
                  v-model="username"
                  label="Username"
                  :rules="[(v) => !!v || 'Username is required']"
                  outlined
                  dense
                />

                <VTextField
                  class="w-100"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  :rules="[(v) => !!v || 'Password is required']"
                  outlined
                  dense
                >
                  <template #append-outer>
                    <VIcon
                      class="clickable"
                      @click="showPassword = !showPassword"
                    >
                      {{ showPassword ? "mdi-eye-off" : "mdi-eye" }}
                    </VIcon>
                  </template>
                </VTextField>

                <VAlert v-if="errorMsg" type="error" dense class="my-2">{{
                  errorMsg
                }}</VAlert>

                <VCardActions>
                  <VBtn
                    icon
                    class="me-2"
                    @click.prevent="signInWithGoogle"
                    aria-label="Sign in with Google"
                  >
                    <VIcon>mdi-google</VIcon>
                  </VBtn>
                  <VSpacer />
                  <VBtn color="primary" type="submit">Sign In</VBtn>
                </VCardActions>
              </VForm>
            </VCardText>
            <VCardActions>
              <VBtn text to="/about">About</VBtn>
              <VSpacer />
              <small class="grey--text"
                >Dev login stores a local `user` entry</small
              >
            </VCardActions>
          </VCard>
        </VContainer>
      </VMain>
    </VApp>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AuthenticationView",
  setup() {
    const username = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const errorMsg = ref("");
    const formRef = ref();
    const router = useRouter();

    const submit = () => {
      errorMsg.value = "";
      if (!username.value || !password.value) {
        errorMsg.value = "Please enter both username and password.";
        return;
      }

      try {
        // For development: store a simple user object in localStorage.
        const user = { username: username.value };
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        // ignore storage errors
      }

      // Navigate to the home page
      router.push({ name: "home" });
    };

    const signInWithGoogle = () => {
      try {
        const user = {
          username: "google_user",
          provider: "google",
          token: "dev-google-token",
        };
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        // ignore storage errors
      }
      router.push({ name: "home" });
    };

    return {
      username,
      password,
      showPassword,
      submit,
      signInWithGoogle,
      errorMsg,
      formRef,
    };
  },
});
</script>

<style scoped>
.auth-view {
  width: 100%;
}
</style>
