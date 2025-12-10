<template>
  <VCard elevation="2" class="overall-stats" color="cardColor">
    <VCardTitle>
      Driving Hours
      <VSpacer />
      <small class="muted">Goal: {{ goalHours }} hrs</small>
    </VCardTitle>

    <VCardText>
      <VRow>
        <VCol cols="12" md="4">
          <div class="stat">
            <div class="label">Day Hours</div>
            <div class="value">{{ dayHours }}</div>
            <div class="muted">Safe daytime practice</div>
          </div>
        </VCol>

        <VCol cols="12" md="4">
          <div class="stat">
            <div class="label">Night Hours</div>
            <div class="value">{{ nightHours }}</div>
            <div class="muted">Important for night driving</div>
          </div>
        </VCol>

        <VCol cols="12" md="4">
          <div class="stat">
            <div class="label">Total</div>
            <div class="value">{{ totalHours }}</div>
            <div class="muted">Remaining: {{ remainingHours }} hrs</div>
          </div>
        </VCol>
      </VRow>

      <div class="progress-wrap">
        <div class="progress-label">Progress toward goal</div>
        <VProgressLinear
          :model-value="progressPct"
          height="14"
          rounded
          color="primary"
        />
        <div class="progress-meta">
          {{ progressPct }}% ({{ totalHours }}/{{ goalHours }} hrs)
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { ref, onMounted } from "vue";
import { db, auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default defineComponent({
  name: "OverallStats",

  setup(props, { expose }) {
    const dayHours = ref(0);
    const nightHours = ref(0);
    const goalHours = ref(50);
    const totalHours = computed(() => dayHours.value + nightHours.value);
    const remainingHours = computed(() =>
      Math.max(0, goalHours.value - totalHours.value)
    );
    const progressPct = computed(() =>
      Math.min(100, Math.round((totalHours.value / goalHours.value) * 100))
    );
    const fetchTotals = async () => {
      try {
        if (!auth.currentUser) return;
        const totalsRef = doc(db, "userTotals", auth.currentUser.uid);
        const snap = await getDoc(totalsRef);
        if (snap.exists()) {
          const data = snap.data();
          dayHours.value = data.dayHours || 0;
          nightHours.value = data.nightHours || 0;
        }
      } catch (error) {
        console.error("Error fetching totals: ", error);
      }
    };
    onMounted(async () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fetchTotals();
        } else {
          console.log("No user is signed in.");
          dayHours.value = 0;
          nightHours.value = 0;
        }
      });
    });

    // Expose fetchTotals so parent components can call it
    expose({
      fetchTotals,
    });

    return {
      dayHours,
      nightHours,
      goalHours,
      totalHours,
      remainingHours,
      progressPct,
      fetchTotals,
    };
  },
});
</script>

<style scoped>
.overall-stats {
  max-width: 800px;
  margin: 1rem auto;
}
.stat {
  padding: 0.5rem 0.75rem;
}
.label {
  font-size: 0.9rem;
  color: #666;
}
.value {
  font-size: 1.6rem;
  font-weight: 600;
  margin-top: 0.25rem;
}
.muted {
  color: #888;
  font-size: 0.85rem;
}
.progress-wrap {
  margin-top: 1rem;
}
.progress-label {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 0.25rem;
}
.progress-meta {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>
