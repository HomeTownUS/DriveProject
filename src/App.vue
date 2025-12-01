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
import { ref } from "vue";

const year = ref(new Date().getFullYear());
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
