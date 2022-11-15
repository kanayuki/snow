<template>

  <div style="display: flex;justify-content: center">

    <div id="three">
      <canvas></canvas>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";

const svg = ref()

onMounted(() => {
  let canvas = document.querySelector('canvas')
  let context = canvas.getContext('2d')
  // let size = window.innerWidth
  let size = 360
  let dpr = window.devicePixelRatio
  canvas.width = size * dpr
  canvas.height = size * dpr
  context.scale(dpr, dpr)

  context.lineCap = 'square'
  context.lineWidth = 2

  let step = 50

  function draw(x, y, width, height) {
    let leftToRight = Math.random() >= 0.5
    if (leftToRight) {
      context.moveTo(x, y)
      context.lineTo(x + width, y + height)
    } else {
      context.moveTo(x + width, y)
      context.lineTo(x, y + height)
    }

    context.stroke()
  }

  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      draw(x, y, step, step)
    }
  }
 })


</script>

<style scoped>
svg.canvas {
  background: #CC95C0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>