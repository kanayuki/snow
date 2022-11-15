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
  // let size = Math.min(window.innerWidth, window.innerHeight)
  let size = 360
  let dpr = window.devicePixelRatio
  canvas.width = size * dpr
  canvas.height = size * dpr
  context.scale(dpr, dpr)

  context.lineJoin = 'bevel'
  // context.lineWidth = 2

  let odd = false
  let lines = []
  let gap = size / 7

  for (let y = gap / 2; y < size; y += gap) {
    odd = !odd
    let line = [];
    for (let x = gap / 4; x < size; x += gap) {
      let dot = {x: x + (odd ? gap / 2 : 0), y: y}
      line.push({
        x: x + (Math.random() * .8 - .4) * gap + (odd ? gap / 2 : 0),
        y: y + (Math.random() * .8 - .4) * gap
      })
      // context.beginPath()
      // context.arc(dot.x, dot.y, 1, 0, 2 * Math.PI, true)
      // context.fill()
    }
    lines.push(line)
  }

  function drawTriangle(pointA, pointB, pointC) {
    context.beginPath()
    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);
    context.lineTo(pointC.x, pointC.y);
    context.lineTo(pointA.x, pointA.y);
    context.closePath();

    // let gray = Math.floor(Math.random() * 16).toString(16);
    // context.fillStyle = '#' + gray + gray + gray;

    let r = Math.floor(Math.random() * 16).toString(16);
    let g = Math.floor(Math.random() * 16).toString(16);
    let b = Math.floor(Math.random() * 16).toString(16);
    context.fillStyle = '#' + r + g + b;
    context.fill();

    context.stroke();
  }

  odd = true

  for (let y = 0; y < lines.length - 1; y++) {
    let dotLine = [];
    odd = !odd
    for (let i = 0; i < lines[y].length; i++) {
      dotLine.push(odd ? lines[y][i] : lines[y + 1][i]);
      dotLine.push(odd ? lines[y + 1][i] : lines[y][i]);
    }
    for (let i = 0; i < dotLine.length - 2; i++) {
      drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2]);
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