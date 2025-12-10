<template>
  <VCard class="main-card" color="cardColor">
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
            color="red"
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
            label="Condition"
            :items="['Sunny', 'Rainy', 'Cloudy', 'Snowy']"
            v-model="selectedWeather"
          ></VSelect>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <VTextField
            hide-details="auto"
            label="Enter Date (MM/DD/YYYY)"
            v-model="date"
            :rules="dateRules"
            placeholder="MM/DD/YYYY"
            @update:model-value="onDateInput"
            @keydown="onDateKeydown"
            @paste="onDatePaste"
            @blur="validateDate"
          />
        </VCol>
      </VRow>

      <VRow class="mt-6">
        <VCol cols="12" class="d-flex justify-space-between">
          <VBtn color="primary" @click="logDrive"> Log Drive </VBtn>
          <VBtn @click="resetForm"> Cancel </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { db, auth } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  increment,
  doc,
  setDoc,
} from "firebase/firestore";

export default defineComponent({
  emits: ["log-saved"],
  setup(_props, { emit }) {
    const selectedWeather = ref("");
    const sliderValue = ref([6, 18]);
    const totalHours = ref(0);
    const date = ref("");
    const dayHours = ref(0);
    const nightHours = ref(0);
    const dateRules = [
      (v: string) =>
        v === "" || isValidDate(v) || "Date must be in MM/DD/YYYY format",
    ];

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
      dayHours.value = 0;
      nightHours.value = 0;
      for (let hour = start; hour < end; hour++) {
        if (hour >= 7 && hour < 19) {
          dayHours.value += 1;
        } else {
          nightHours.value += 1;
        }
      }
    };

    // Date input helpers
    function formatDateInput(raw: string) {
      const digits = raw.replace(/\D/g, "").slice(0, 8);
      const parts: string[] = [];
      if (digits.length <= 2) parts.push(digits);
      else if (digits.length <= 4)
        parts.push(digits.slice(0, 2), digits.slice(2));
      else parts.push(digits.slice(0, 2), digits.slice(2, 4), digits.slice(4));
      return parts.filter(Boolean).join("/");
    }

    function isValidDate(value: string) {
      const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!m) return false;
      const month = Number(m[1]);
      const day = Number(m[2]);
      const year = Number(m[3]);
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      const d = new Date(year, month - 1, day);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === day
      );
    }

    function onDateInput(val: string) {
      date.value = formatDateInput(String(val || ""));
    }

    function onDateKeydown(e: KeyboardEvent) {
      const allowed = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
      ];
      if (allowed.includes(e.key)) return;
      if (/^\d$/.test(e.key)) return;
      // prevent any non-digit input (including letters and symbols)
      e.preventDefault();
    }

    function onDatePaste(e: ClipboardEvent) {
      const data =
        (e.clipboardData || (window as any).clipboardData)?.getData("text") ||
        "";
      const formatted = formatDateInput(data);
      date.value = formatted;
      e.preventDefault();
    }

    function validateDate() {
      if (date.value === "") return true;
      return isValidDate(date.value);
    }

    const logDrive = async () => {
      if (!auth.currentUser) {
        alert("You must be logged in to log a drive.");
        return;
      }
      if (totalHours.value === 0) {
        alert("You must have at least 1 hour to log a drive.");
        return;
      }

      try {
        await addDoc(collection(db, "drivingLogs"), {
          userId: auth.currentUser.uid,
          startTime: sliderValue.value[0],
          endTime: sliderValue.value[1],
          totalHours: totalHours.value,
          dayHours: dayHours.value,
          nightHours: nightHours.value,
          date: date.value,
          createdAt: serverTimestamp(),
          weather: selectedWeather.value,
        });

        const totalsref = doc(db, "userTotals", auth.currentUser.uid);
        await setDoc(
          totalsref,
          {
            dayHours: increment(dayHours.value),
            nightHours: increment(nightHours.value),
          },
          { merge: true }
        );

        alert("Driving log added successfully!");
        emit("log-saved"); // Notify parent that a log was saved
        resetForm();
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to add driving log.");
      }
    };
    const resetForm = () => {
      sliderValue.value = [6, 18];
      totalHours.value = 0;
      dayHours.value = 0;
      nightHours.value = 0;
      date.value = "";
      selectedWeather.value = "";
    };

    return {
      sliderValue,
      totalHours,
      formatTime,
      calculateHours,
      date,
      dateRules,
      onDateInput,
      validateDate,
      onDateKeydown,
      onDatePaste,
      selectedWeather,
      logDrive,
      resetForm,
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
