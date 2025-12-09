<template>
  <v-app>
    <v-app-bar color="primary" dark elevated dense>
      <v-app-bar-title class="brand">
        <v-icon left>mdi-car</v-icon>
        Drive Project
      </v-app-bar-title>

      <v-spacer />

      <v-btn variant="text" to="/">Home</v-btn>
      <v-btn variant="text" to="/about">About</v-btn>

      <div v-if="user" class="me-2">
        {{ user.displayName || user.email }}
      </div>

      <v-btn icon @click="goToAuth"
        ><v-icon>{{ user ? "mdi-logout" : "mdi-login" }}</v-icon></v-btn
      >
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer height="48" class="d-flex justify-center">
      <div class="footer-text">© {{ year }}</div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, signInWithGoogle, logOut } from "@/firebase";

const router = useRouter();
const user = ref<User | null>(null);
const year = ref(new Date().getFullYear());

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });
});

const goToAuth = async () => {
  if (user.value) {
    await logOut();
  } else {
    await signInWithGoogle();
  }
};
</script>

<style scoped>
.brand {
  font-weight: 700;
  letter-spacing: 0.4px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}
</style>
