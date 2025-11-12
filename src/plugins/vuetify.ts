// src/plugins/vuetify.ts
import "vuetify/styles"; // Global CSS has to be imported
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  components,
  directives,
  // You can add theme, icons, etc. here

  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#E85A4F",
          secondary: "#E98074",
          background: "#D8C3A5",
          accent: "#8E8D8A",
          // cardColor should be a valid hex string (include leading #)
          cardColor: "#EAE7DC",
        },
      },
    },
  },
});
