// src/plugins/vuetify.ts
import "vuetify/styles"; // Global CSS has to be imported
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  components,
  directives,
  // You can add theme, icons, etc. here
});
