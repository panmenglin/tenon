<template>
  <div id="app">
    <PieChart />
  </div>
</template>

<script>
import PieChart from './components/ChartPie.vue'

export default {
  name: 'App',
  components: {
    PieChart
  }
}
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
