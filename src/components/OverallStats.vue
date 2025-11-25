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

export default defineComponent({
  name: "OverallStats",
  props: {
    dayHours: {
      type: Number,
      default: 12,
    },
    nightHours: {
      type: Number,
      default: 3,
    },
    goalHours: {
      type: Number,
      default: 50,
    },
  },
  setup(props) {
    const totalHours = computed(() => props.dayHours + props.nightHours);
    const remainingHours = computed(() =>
      Math.max(0, props.goalHours - totalHours.value)
    );
    const progressPct = computed(() =>
      Math.min(100, Math.round((totalHours.value / props.goalHours) * 100))
    );

    return {
      totalHours,
      remainingHours,
      progressPct,
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
