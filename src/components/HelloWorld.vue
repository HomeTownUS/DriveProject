<template>
  <div class="hello">
    <VApp>
      <VMain>
        <VContainer>
          <VToolbar flat>
            <VToolbarTitle>{{ msg }}</VToolbarTitle>
            <VSpacer />
            <VSwitch v-model="isDark" label="Dark" @change="toggleTheme" />
          </VToolbar>

          <VRow class="my-4" align="center">
            <VCol cols="12" md="6">
              <VCard>
                <VCardTitle>Buttons & Icons</VCardTitle>
                <VCardText>
                  <VBtn color="primary" class="ma-2" @click="clickCount++">
                    Primary ({{ clickCount }})
                  </VBtn>
                  <VBtn color="secondary" class="ma-2" icon>
                    <VIcon>mdi-heart</VIcon>
                  </VBtn>
                  <VChip class="ma-2" color="info">Info Chip</VChip>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" md="6">
              <VCard>
                <VCardTitle>Form controls</VCardTitle>
                <VCardText>
                  <VTextField v-model="text" label="Your name" />
                  <VSelect
                    v-model="selected"
                    :items="['One', 'Two', 'Three']"
                    label="Choose"
                  />
                  <VCheckbox v-model="checked" label="Agree?" />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="12" md="6">
              <VCard>
                <VCardTitle>Progress & Avatar</VCardTitle>
                <VCardText class="d-flex align-center">
                  <VProgressCircular
                    :size="64"
                    :value="progress"
                    class="ma-2"
                  />
                  <VAvatar size="64" class="ma-2">
                    <img src="../assets/logo.png" alt="logo" />
                  </VAvatar>
                </VCardText>
                <VCardActions>
                  <VBtn text @click="incrementProgress">Increase</VBtn>
                </VCardActions>
              </VCard>
            </VCol>

            <VCol cols="12" md="6">
              <VList>
                <VListItem v-for="item in items" :key="item">
                  <VListItemTitle>{{ item }}</VListItemTitle>
                </VListItem>
              </VList>
            </VCol>
          </VRow>
        </VContainer>
      </VMain>
    </VApp>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useTheme } from "vuetify";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isDark = ref(false);
    const clickCount = ref(0);
    const text = ref("");
    const selected = ref("");
    const checked = ref(false);
    const progress = ref(25);
    const items = ref(["First item", "Second item", "Third item"]);

    const theme = useTheme();

    const toggleTheme = () => {
      theme.global.name.value = isDark.value ? "dark" : "light";
    };

    const incrementProgress = () => {
      progress.value = Math.min(100, progress.value + 10);
    };

    return {
      isDark,
      clickCount,
      text,
      selected,
      checked,
      progress,
      items,
      toggleTheme,
      incrementProgress,
    };
  },
});
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
</style>
