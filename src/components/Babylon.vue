<template>
  <div>

    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>

import * as BABYLON from "babylonjs";

import {onMounted} from 'vue'


onMounted(() => {
  const canvas = document.getElementById('canvas')
  canvas.width = window.innerWidth - 24
  canvas.height = window.innerHeight - 16
  const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

  function createScene() {
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)

    let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere1', {
      segments: 16,
      diameter: 2,
      sideOrientation: BABYLON.Mesh.FRONTSIDE
    }, scene);

    sphere.position.y = 1;

    let ground = new BABYLON.MeshBuilder.CreateGround('ground1', {
      width: 6,
      height: 6,
      subdivisions: 2,
      updatable: false
    }, scene);

    return scene
  }

  const scene = createScene();

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', ev => {
    engine.resize()
  })

});

</script>

<style scoped>

</style>