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
  // let size = Math.min(window.innerWidth, window.innerHeight)
  let size = 360
  let dpr = window.devicePixelRatio
  canvas.width = size * dpr
  canvas.height = size * dpr
  context.scale(dpr, dpr)

  context.lineWidth = 2

  let circles = []
  let minRadius = 2
  let maxRadius = 100
  let totalCircles = 999
  let createCircleAttempts = 500

  function createAndDrawCircle() {
    let newCircle
    let circleSafeToDraw = false;
    for (let tries = 0; tries < createCircleAttempts; tries++) {
      newCircle = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
        radius: minRadius
      }
      if (!doesCircleHaveACollision(newCircle)) {
        circleSafeToDraw = true
        break
      }
    }
    if (!circleSafeToDraw) {
      return
    }

    for (let radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
      newCircle.radius = radiusSize;
      if (doesCircleHaveACollision(newCircle)) {
        newCircle.radius--
        break
      }
    }

    circles.push(newCircle)
    context.beginPath()
    context.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2 * Math.PI)
    context.stroke()
  }

  function doesCircleHaveACollision(circle) {
    for (let i = 0; i < circles.length; i++) {
      let otherCircle = circles[i]
      let a = otherCircle.radius + circle.radius
      let x = otherCircle.x - circle.x
      let y = otherCircle.y - circle.y
      if (a >= Math.sqrt(x * x + y * y)) {
        return true
      }
    }

    return circle.x + circle.radius >= size || circle.x - circle.radius <= 0
        || circle.y + circle.radius >= size || circle.y - circle.radius <= 0
  }

  for (let i = 0; i < totalCircles; i++) {
    createAndDrawCircle()
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