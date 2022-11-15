<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import CircularFunction from "./components/CircularFunction.vue";
import CircularFunction2 from "./components/CircularFunction2.vue";
import Epicycles from "./components/Epicycles.vue";
import Epiwave from "./components/CircularFunction2.vue";
import Three from "./components/Three.vue";
import TriangularMesh from "./components/TriangularMesh.vue";
import CirclePacking from "./components/CirclePacking.vue";
import JoyDivision from "./components/JoyDivision.vue";
import PietMondrian from "./components/PietMondrian.vue";
import TiledLines from "./components/TiledLines.vue";
import HoursOfDark from "./components/HoursOfDark.vue";
import Babylon from "./components/Babylon.vue";
import {computed, ref} from "vue";

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash;
})

const routes = {
  '/': HelloWorld,
  '/babylon': Babylon,
  '/circle': Epicycles,
  '/Epiwave': Epiwave,
  '/three': Three,
  '/TriangularMesh': TriangularMesh,
  '/CirclePacking': CirclePacking,
  '/JoyDivision': JoyDivision,
  '/PietMondrian': PietMondrian,
  '/TiledLines': TiledLines,
  '/HoursOfDark': HoursOfDark,

}

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || CircularFunction2
})
</script>

<template>
  <!--    <img alt="Vue logo" src="./assets/logo.png" />-->
  <div class="bar">
    <a href="#/">Home</a>
    <a href="#/babylon">Babylon</a>
    <a href="#/circle">Circle</a>
    <a href="#/Epiwave">Epiwave</a>
    <a href="#/three">three</a>
    <a href="#/TriangularMesh">TriangularMesh</a>
    <a href="#/CirclePacking">CirclePacking</a>
    <a href="#/JoyDivision">JoyDivision</a>
    <a href="#/PietMondrian">PietMondrian</a>
    <a href="#/TiledLines">TiledLines</a>
    <a href="#/HoursOfDark">HoursOfDark</a>
  </div>

  <component :is="currentView"/>
  <!--    <HelloWorld msg="Hello Vue 3 + Vite" />-->

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

.bar {
  display: flex;
  justify-content: space-evenly;
}
</style>
