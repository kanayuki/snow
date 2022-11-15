<template>

  <div style="display: flex;justify-content: center">

    <div id="three">
      <canvas></canvas>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";

const svg = ref(null)


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

  let step = 10
  let lines = []

  for (let i = step; i <= size - step; i += step) {
    let line = []
    for (let j = step; j <= size - step; j += step) {
      let distanceToCenter = Math.abs(j - size / 2);
      let variance = Math.max(size / 2 - 50 - distanceToCenter, 0);
      let random = Math.random() * variance / 2 * -1;
      line.push([j, i + random])
    }
    lines.push(line)
  }

  for (let i = 5; i < lines.length; i++) {
    context.beginPath()
    context.moveTo(...lines[i][0])
    for (let j = 1; j < lines[i].length - 2; j++) {
      let [x1, y1] = lines[i][j]
      let [x2, y2] = lines[i][j + 1]
      context.quadraticCurveTo(...lines[i][j], (x1 + x2) / 2, (y1 + y2) / 2);
    }
    let lastIndex = lines[i].length - 1
    context.quadraticCurveTo(...lines[i][lastIndex - 1], ...lines[i][lastIndex])

    context.save()
    context.globalCompositeOperation = 'destination-out';
    context.fill();
    context.restore()
    context.stroke();
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