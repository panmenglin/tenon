<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="24">
      <ChartColumn />
    </a-col>
  </a-row>
</template>

<script>
import ChartColumn from "./components/ChartLine.vue";

export default {
  name: "App",
  components: {
    ChartColumn,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
