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

  context.lineWidth = 8;

  let step = size / 6
  let colors = ['#D40920', '#1356A2', '#F7D842'];

  let squares = [{
    x: 0,
    y: 0,
    width: size,
    height: size,
  }]

  function splitSquaresWith(coordinates) {
    const {x, y} = coordinates;
    for (let i = squares.length - 1; i >= 0; i--) {
      let square = squares[i];
      if (x && x > square.x && x < square.x + square.width) {
        if (Math.random() > 0.5) {
          squares.splice(i, 1);
          splitOnX(square, x);
        }
      }

      if (y && y > square.y && y < square.y + square.height) {
        if (Math.random() > 0.5) {
          squares.splice(i, 1);
          splitOnY(square, y);
        }
      }
    }
  }

  function splitOnX(square, splitAt) {
    let {x, y, width, height} = square;
    squares.push({x, y, width: splitAt - x, height})
    squares.push({x: splitAt, y, width: x + width - splitAt, height})
  }

  function splitOnY(square, splitAt) {
    let {x, y, width, height} = square;
    squares.push({x, y, width, height: splitAt - y})
    squares.push({x, y: splitAt, width, height: y + height - splitAt})
  }


  for (let i = 0; i < size; i += step) {
    splitSquaresWith({x: i})
    splitSquaresWith({y: i})
  }

  for (let i = 0; i < colors.length; i++) {
    let index = Math.floor(Math.random() * squares.length);
    console.log(squares.length, index);
    squares[index].color = colors[i];
  }

  function draw() {
    for (let i = 0; i < squares.length; i++) {
      let {x, y, width, height} = squares[i];
      context.beginPath();
      context.rect(x, y, width, height);

      context.fillStyle = squares[i].color || '#F2F5F1'
      context.fill();

      context.stroke();
    }
  }

  draw();
})


</script>

<style scoped>
svg.canvas {
  background: #CC95C0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>