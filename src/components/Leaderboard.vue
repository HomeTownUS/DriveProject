<template>
  <v-list style="background-color: #eae7dc" lines="one">
    <h3>Leaderboard</h3>
    <v-list-item v-for="(user, index) in users" :key="user.id">
      <v-list-item-content>
        <v-list-item-title>
          {{ index + 1 }}. {{ user.name }} - {{ user.totalHours }} Hours
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { db, auth } from "@/firebase";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface User {
  id: string;
  name: string;
  totalHours: number;
}

export default defineComponent({
  name: "LeaderboardComponent",
  setup() {
    const users = ref<User[]>([]);

    const fetchUsers = () => {
      if (!auth.currentUser) return;
      const usersRef = collection(db, "userTotals");
      onSnapshot(usersRef, (snapshot: QuerySnapshot) => {
        const userList: User[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          const data = doc.data();
          userList.push({
            id: doc.id,
            name: data.name || "Anonymous",
            totalHours: data.dayHours + data.nightHours || 0,
          });
        });
        // Sort users by totalHours in descending order
        users.value = userList.sort((a, b) => b.totalHours - a.totalHours);
      });
    };

    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fetchUsers();
        } else {
          users.value = [];
        }
      });
    });

    return {
      users,
    };
  },
});
</script>

<style>
.fullList {
  background-color: #eae7dc;
}
h3 {
  text-align: center;
}
</style>
