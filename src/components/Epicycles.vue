<template>
  <div id="circular">
    <svg :width="width" :height="height" class="canvas" ref="svg">
      <defs>
        <marker id="arrow" orient="auto" markerWidth="6" markerHeight="8" refX="6" refY="4">
          <!--          <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>-->
          <path d="M0,0 L2,4 L0,8 L6,4 L0,0" fill="black"></path>
        </marker>
      </defs>
      <g :transform="`translate(${width/2},${height/2})`">
        <g class="axes"></g>
        <g class="graphics" fill="none" stroke="black">
          <circle stroke="gray" v-for="([[cx,cy],r],index) in circles" :key="index"
                  :cx="xScale(cx)" :cy="yScale(cy)" :r="xScale(r)"/>

          <!--          <line v-for="([[x1,y1],[x2,y2]],index) in line" :key="index"-->
          <!--                :x1="x1" :y1="y1" :x2="x2" :y2="y2"/>-->

          <path v-for="(line,i) in arrowLines" :key="i" :d="line"
                marker-end="url(#arrow)" stroke-width="2"></path>

          <path :d="sinWave" stroke="steelblue" stroke-width="3"></path>
          <path :d="cosWave" stroke="steelblue" stroke-width="3"></path>

          <path :d="indicator" stroke="orange"></path>

          <path :d="trackLine" stroke="deeppink" stroke-width="3"></path>

          <circle r="3" :cx="xScale(p[0])" :cy="yScale(p[1])" fill="magenta"/>
          <circle r="2" :cx="xScale(last(cosPoints)[0])" :cy="yScale(last(cosPoints)[1])" fill="magenta"/>
          <circle r="2" :cx="xScale(last(sinPoints)[0])" :cy="yScale(last(sinPoints)[1])" fill="magenta"/>

        </g>
      </g>
    </svg>
  </div>
  <div style="position:fixed;right: 25px;top: 50px">

    <n-space vertical>

      <n-button text size="large">
        <NIcon size="48">
          <SettingsRound/>
        </NIcon>
      </n-button>

      <n-button text size="large">
        <NIcon size="48">
          <SettingsRound/>
        </NIcon>
      </n-button>
      <n-button text size="large" @click="toggle">
        <NIcon size="48">
          <FullscreenRound/>
        </NIcon>
      </n-button>
      <n-button text size="large">
        <NIcon size="48">
          <PlusRound/>
        </NIcon>
      </n-button>
      <n-button text size="large">
        <NIcon size="48">
          <MinusRound/>
        </NIcon>
      </n-button>
      <n-button text size="large">
        <NIcon size="48">
          <ZoomOutMapRound/>
        </NIcon>
      </n-button>
    </n-space>
  </div>
  <div style="position:fixed;right: 100px;top: 50px">
    <NCard>
      Mouse:{{ x }}x{{ y }}
    </NCard>

    <NCard hoverable style="width: calc(100vw*0.25)">
      <n-button text size="large">
        <NIcon size="48">
          <PlayCircleOutlineRound/>
        </NIcon>
      </n-button>
      <n-button text size="large" @click="cs=randomComplex(2,5)">
        <n-icon size="48">
          <AutorenewRound/>
        </n-icon>
      </n-button>
      <div>time:{{ time }}</div>

      <n-space vertical>
        <n-slider v-model:value.number="time" :min="0" :max="4*pi" :step="step"/>
        <n-input-number size="small" v-model:value="time"/>
      </n-space>

      <n-color-picker :swatches="['#FFFFFF', '#18A058', '#2080F0', '#F0A020', 'rgba(208, 48, 80, 1)']"/>

      <div id="three"></div>
    </NCard>

  </div>
</template>

<script setup>
import * as d3 from "d3";
import {onMounted, ref, watch, computed} from "vue";
import {useMouse, useWindowSize, useFullscreen} from '@vueuse/core'
import {NButton, NSpace, NSlider, NInputNumber, NIcon, NCard, NColorPicker,} from 'naive-ui'
import {evaluate, pi} from 'mathjs'
import {
  PlayCircleOutlineRound, FullscreenRound, PlusRound, MinusRound,
  AutorenewRound, ZoomOutMapRound, SettingsRound
} from '@vicons/material'

import {compileVectors, calcVectors, randomComplex, reIm, dft, last} from '../fourierUtils'
import {useEpicycles} from '../composables/epicycles'

import air from '../assets/airplane.svg'

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

console.log('air:', air);


const {width, height} = useWindowSize()
const {x, y} = useMouse()

const svg = ref(null)
const {toggle} = useFullscreen(svg)

const xDomain = 12
const xScale = d3.scaleLinear([-xDomain, xDomain], [-width.value / 2, width.value / 2])
const yDomain = Math.ceil(xScale.invert(height.value / 2))
const yScale = d3.scaleLinear([-yDomain, yDomain], [yDomain, -yDomain].map(xScale))

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisRight(yScale)

const r = ref(2)

const curve = d3.line().x(([x, _]) => xScale(x)).y(([_, y]) => yScale(y)).curve(d3.curveCardinal)
const line = d3.line().x(([x, _]) => xScale(x)).y(([_, y]) => yScale(y))

// 初始向量列表，复数形式表示
// const cs = ref(['2*e^(i*pi/3)', 'e^(i*pi/2)', '0.8*e^(-i*pi/6)'])
const test = dft(evaluate(['1+i', '2+1.5*i', '3-2*i']))
// 初始向量，表示每个旋转向量的初始方向和大小
let cs = ref(test)
const {time, step, circles, ps, p, track, cosPoints, sinPoints} = useEpicycles(cs)

// 旋转的向量
const arrowLines = computed(() => d3.pairs(ps.value).map(line))
const trackLine = computed(() => curve(track.value))

const indicator = computed(() => line([last(cosPoints.value), p.value, last(sinPoints.value)]))
const cosWave = computed(() => curve(cosPoints.value))
const sinWave = computed(() => line(sinPoints.value))

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

  let g = d3.select(svg.value).select("g")

  const axes = g.select(".axes")
  axes.append("g").call(xAxis)
  axes.append("g").call(yAxis)

  // 定义缩放行为，为zoom事件设置事件处理器
  let zoom = d3.zoom().on("zoom", function (event) {

    g.attr("transform", event.transform)
    const {x, y, k} = event.transform
    // axes.attr("transform", `translate(${x},${y})`)
  })

  d3.select(svg.value).call(zoom)

  svg.value.addEventListener('click', ev => {
    console.log('ev:', ev);
    g.append('circle').attr('r', 3)
        .attr('cx', ev.offsetX - width.value / 2)
        .attr('cy', ev.offsetY - height.value / 2)

  })
})


</script>

<style scoped>
svg.canvas {
  background: #CC95C0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #7AA1D2, #DBD4B4, #CC95C0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>