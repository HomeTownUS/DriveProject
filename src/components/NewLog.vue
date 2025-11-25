<template>
  <VCard class="main-card">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCardTitle class="text-center card-title"
            >New Driving Log</VCardTitle
          >
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <VRangeSlider
            v-model="sliderValue"
            min="1"
            max="25"
            step="1"
            thumb-label="always"
            :thumb-size="12"
            @update:model-value="calculateHours"
          >
            <template #thumb-label="{ modelValue }">
              <span class="thumb-text">{{ formatTime(modelValue) }}</span>
            </template>
          </VRangeSlider>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <h3 class="hours-log">{{ totalHours }} Hours</h3>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <VSelect
            label="Select"
            :items="['Sunny', 'Rainy', 'Cloudy', 'Snowy']"
          ></VSelect>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <VTextField hide-details="auto" label="Enter Date"></VTextField>
        </VCol>
      </VRow>

      <VRow class="mt-6">
        <VCol cols="12" class="d-flex justify-space-between">
          <VBtn color="primary" @click="handleLogDrive"> Log Drive </VBtn>
          <VBtn> Cancel </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const sliderValue = ref([6, 18]);
    const totalHours = ref(0);

    const formatTime = (hour: number) => {
      const times: Record<number, string> = {
        1: "12 AM",
        2: "1 AM",
        3: "2 AM",
        4: "3 AM",
        5: "4 AM",
        6: "5 AM",
        7: "6 AM",
        8: "7 AM",
        9: "8 AM",
        10: "9 AM",
        11: "10 AM",
        12: "11 AM",
        13: "12 PM",
        14: "1 PM",
        15: "2 PM",
        16: "3 PM",
        17: "4 PM",
        18: "5 PM",
        19: "6 PM",
        20: "7 PM",
        21: "8 PM",
        22: "9 PM",
        23: "10 PM",
        24: "11 PM",
        25: "12 AM",
      };
      return times[hour] || `${hour}:00`;
    };

    // Calculate hours between start and end time
    const calculateHours = () => {
      const [start, end] = sliderValue.value;
      totalHours.value = end - start;
      return totalHours.value;
    };

    return {
      sliderValue,
      totalHours,
      formatTime,
      calculateHours,
    };
  },
});
</script>

<style scoped>
.main-card {
  margin: 1rem auto;
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
}

.thumb-text {
  font-size: 7px;
  font-weight: 500;
}

.hours-log {
  font-size: 1.5rem;
}
</style>
