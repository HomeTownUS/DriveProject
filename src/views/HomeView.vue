<template>
  <div class="home">
    <HelloWorld msg="EPIC DRIVING" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
})
class HomeView extends Vue {}

export default HomeView;
</script>
