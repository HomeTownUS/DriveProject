<template>
  <div class="hello">
    <VApp>
      <VMain>
        <VContainer>
          <VToolbar flat color="cardColor">
            <VToolbarTitle>{{ msg }}</VToolbarTitle>
            <VSpacer />
          </VToolbar>

          <VRow class="my-4">
            <VCol cols="12" md="6">
              <!-- Demo: overall stats card (sample values passed) -->
              <OverallStats ref="overallStatsRef" />
              <VCard color="cardColor"> </VCard>
              <!--
	      <VCard color="cardColor">
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
	      -->
            </VCol>
            <VCol cols="12" md="6">
              <NewLog @log-saved="handleLogSaved" />
            </VCol>
            <!--
            <VCol cols="12" md="6">
              <VCard color="cardColor">
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
	    -->
          </VRow>

          <VRow>
            <!--
            <VCol cols="12" md="6">
              <VCard color="cardColor">
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
	    -->

            <VCol cols="12" md="12">
              <VList>
                <VListItem v-for="item in items" :key="item">
                  <VListItemTitle
                    >Drive: {{ item.startTime }} to {{ item.endTime }} for a
                    total of {{ item.totalHours }} hours on
                    {{ item.date }}.</VListItemTitle
                  >
                  <VListItemSubtitle
                    >Day hours: {{ item.dayHours }} Night hours:
                    {{ item.nightHours }} Weather:
                    {{ item.weather }}</VListItemSubtitle
                  >
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
import { defineComponent, ref, onMounted, computed } from "vue";
import OverallStats from "@/components/OverallStats.vue";
import NewLog from "./NewLog.vue";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Unsubscribe } from "firebase/auth";

export default defineComponent({
  name: "HelloWorld",
  components: { OverallStats, NewLog },
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {
    const clickCount = ref(0);
    const text = ref("");
    const selected = ref("");
    const checked = ref(false);
    const progress = ref(25);
    const unsubscribe = ref<Unsubscribe | null>(null);
    const items = computed(() =>
      logs.value.filter((log) => log.userId === auth.currentUser?.uid)
    );

    const logCollection = collection(db, "drivingLogs");

    const logs = ref<any[]>([]);

    const fetchLogs = async () => {
      unsubscribe.value = onSnapshot(logCollection, (qs: QuerySnapshot) => {
        //set beverages if beverages are not empty
        if (!qs.empty) {
          logs.value = qs.docs.map((qd: QueryDocumentSnapshot) => ({
            userId: qd.data().userId,
            startTime: qd.data().startTime,
            endTime: qd.data().endTime,
            totalHours: qd.data().totalHours,
            dayHours: qd.data().dayHours,
            nightHours: qd.data().nightHours,
            date: qd.data().date,
            createdAt: qd.data().createdAt,
            weather: qd.data().weather,
          }));
        }
      });
    };
    onMounted(async () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fetchLogs();
        } else {
          console.log("No user is signed in.");
          unsubscribe.value = null;
        }
      });
    });

    const overallStatsRef = ref();

    const incrementProgress = () => {
      progress.value = Math.min(100, progress.value + 10);
    };

    const handleLogSaved = () => {
      // When a new log is saved, refresh the stats
      if (overallStatsRef.value) {
        overallStatsRef.value.fetchTotals();
      }
    };

    return {
      clickCount,
      text,
      selected,
      checked,
      progress,
      items,
      incrementProgress,
      overallStatsRef,
      handleLogSaved,
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
