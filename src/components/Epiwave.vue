<template>
  <path :d="sinWave" stroke="steelblue" stroke-width="3"></path>
  <path :d="cosWave" stroke="steelblue" stroke-width="3"></path>

  <path :d="indicator" stroke="orange"></path>

  <path :d="trackLine" stroke="deeppink" stroke-width="3"></path>

  <circle r="3" :cx="xScale(p[0])" :cy="yScale(p[1])" fill="magenta"/>
  <circle r="2" :cx="xScale(last(cosPoints)[0])" :cy="yScale(last(cosPoints)[1])" fill="magenta"/>
  <circle r="2" :cx="xScale(last(sinPoints)[0])" :cy="yScale(last(sinPoints)[1])" fill="magenta"/>

</template>

<script setup>


</script>

<style scoped>

</style>