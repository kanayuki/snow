<template>

  <div style="display: flex;justify-content: center">
    <NCard>
      Mouse:{{ x }}x{{ y }}
    </NCard>
    <div id="three" ></div>

    <NCard hoverable>
      <n-color-picker :swatches="['#FFFFFF', '#18A058', '#2080F0', '#F0A020', 'rgba(208, 48, 80, 1)']"/>
    </NCard>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import {onMounted, ref} from "vue";
import {useMouse, useWindowSize} from '@vueuse/core'
import {min, pi} from 'mathjs'
import {AutorenewRound, PlayCircleOutlineRound} from '@vicons/material'

import {randomComplex} from '../fourierUtils'

import air from '../assets/airplane.svg'

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

console.log('air:', air);


const {width, height} = useWindowSize()
const {x, y} = useMouse()

const svg = ref(null)


// fetch(air).then(value => value.text())
//     .then(value => {
//       const div = document.createElement('div');
//       div.innerHTML = value
//       console.log('div:', div);
//       const path = div.querySelector('path')
//       const d = path.getAttribute("d")
//       console.log('d:', d);
//       const pts = d.split(/[a-zA-Z]/).map(coor => coor.split(' '))
//       console.log('pts:', pts);
//
//     })


onMounted(() => {

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera()
  const renderer = new THREE.WebGLRenderer()
  const {innerWidth: width, innerHeight: height} = window;
  const size = min(width, height);
  renderer.setSize(size,size)
  document.querySelector('#three').append(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  const axes3d = new THREE.AxesHelper(20)
  scene.add(axes3d)

  const cubeGeometry = new THREE.BoxGeometry(...[10, 10, 10, 3, 3, 3])
  const cubeMaterial = new THREE.MeshBasicMaterial({color: 'pink', wireframe: true})
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  scene.add(cube)

  const vector3s = [[-10, 0, 0], [0, 10, 0], [10, 0, 0]].map(pt => new THREE.Vector3(...pt))
  const points = new THREE.CatmullRomCurve3(vector3s).getPoints(2)
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  const lineMaterial = new THREE.LineBasicMaterial({color: 'magenta'})
  const line = new THREE.Line(lineGeometry, lineMaterial)
  scene.add(line)

  camera.position.z = 20

  const animate = () => {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    controls.update()
    renderer.render(scene, camera)
  }

  animate()


})


</script>

<style scoped>
svg.canvas {
  background: #CC95C0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>