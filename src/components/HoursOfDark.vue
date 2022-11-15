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

  let canvas = document.querySelector('canvas');
  let context = canvas.getContext('2d');
  let size = 320;
  let dpr = window.devicePixelRatio;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  context.scale(dpr, dpr);

  // context.lineWidth = 8;

  let cols = 23
  let rows = 16
  let days = 365

  let gridw = size * 0.9
  let gridh = size * 0.7
  let cellw = gridw / cols
  let cellh = gridh / rows
  let margx = (size - gridw) * 0.5
  let margy = (size - gridh) * 0.5

  for (let i = 0; i < days; i++) {
    let col = Math.floor(i / rows);
    let row = i % rows;

    let x = margx + cellw * col;
    let y = margy + cellh * row;
    let w = 2;
    let h = 30;

    context.save();
    context.translate(x, y);

    context.beginPath()
    context.rect(0, 0, cellw, cellh);
    context.clip()

    context.translate(cellw * .5, cellh * .5);

    let phi = (i / days) * Math.PI;
    let theta = Math.sin(phi) * Math.PI * 0.45 + 0.85;

    context.rotate(theta);

    let scale = Math.abs(Math.cos(phi)) * 2 + 1;

    context.scale(scale, 1);

    context.beginPath();
    context.rect(w * -.5, h * -.5, w, h);
    context.fill();

    context.restore();
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