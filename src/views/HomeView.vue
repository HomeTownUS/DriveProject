<template>
  <div class="home">
    <HelloWorld msg="Welcome to the EPIC Driving App" />
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
