<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  methods: {
    /**
     * @NOTE - This is some note about a method
     *   There might be text here,
     * or here.
     * @TODO - Something
     * @ERROR - Something else
     */
    decodeObject() {
      console.log("@decodeObject");
    },
  },
};
</script>
