<template>
  <div id="circular">
    <svg :width="WIDTH" :height="HEIGHT">
      <g :transform="`translate(${WIDTH/2},${HEIGHT/2})`">
        <g class="axes"></g>
        <g class="graphics" fill="none" stroke="black">
          <circle :r="xScale(r)" stroke="gray"/>
          <line x1="0" y1="0" :x2="p[0]" :y2="p[1]"/>
          <line :x1="p[0]" :y1="p[1]" :x2="xScale(d)" :y2="p[1]" stroke="pink"/>
          <line :x1="p[0]" :y1="p[1]" :x2="p[0]" :y2="yScale(d)" stroke="pink"/>

          <path :d="sinWave" stroke="steelblue" stroke-width="3"></path>
          <path :d="cosWave" stroke="steelblue" stroke-width="3"></path>

          <circle r="3" :cx="p[0]" :cy="p[1]" fill="magenta"/>
          <circle r="2" :cx="xScale(d)" :cy="p[1]" fill="deeppink" stroke="none"/>
          <circle r="2" :cx="p[0]" :cy="yScale(d)" fill="deeppink" stroke="none"/>
        </g>
      </g>
    </svg>
  </div>
  <div style="position:fixed;left: 75%;top: 50px">
    <button>Play</button>
    <div>time:{{ time }}</div>
    <input type="range" v-model.number="time" min="0" max="10" step="0.01">

    <div>omega:{{ omega }}</div>
    <input type="range" v-model.number="omega" min="0" max="5" step="0.01">
    <br/>
    <div>r:{{ r }}</div>
    <input type="range" v-model.number="r" min="0" max="10" step="0.01">
    <br/>
    <div>d:{{ d }}</div>
    <input type="range" v-model.number="d" min="0" max="10" step="0.01">
  </div>
</template>

<script setup>
import * as d3 from "d3";
import {onMounted, ref, watch, computed} from "vue";


const WIDTH = innerWidth
const HEIGHT = innerHeight - 100

const xDomain = 12
const xScale = d3.scaleLinear([-xDomain, xDomain], [-WIDTH / 2, WIDTH / 2])
const yDomain = Math.ceil(xScale.invert(HEIGHT / 2))
const yScale = d3.scaleLinear([-yDomain, yDomain], [yDomain, -yDomain].map(xScale))

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisRight(yScale)

const time = ref(0)
const r = ref(2)
const d = ref(r.value + 0.5)
const omega = ref(1)

const p = computed(() => [r.value * Math.cos(omega.value * time.value), -r.value * Math.sin(omega.value * time.value)].map(xScale))

const tRange = computed(() => d3.range(d.value, time.value + d.value, 0.1 - 0.012 * omega.value))

const cosWave = computed(() => {
  let cosLine = d3.line().x(t => xScale(r.value * Math.cos(-omega.value * (t - d.value - time.value)))).y(yScale)
  return cosLine(tRange.value)
})

const sinWave = computed(() => {
  let sinLine = d3.line().x(xScale).y(t => yScale(r.value * Math.sin(-omega.value * (t - d.value - time.value))))
  return sinLine(tRange.value)
})


onMounted(() => {
  let svg = d3.select("svg")
  let g = svg.select("g")

  const axes = svg.select(".axes")
  axes.append("g").call(xAxis)
  axes.append("g").call(yAxis)


  const graphics = svg.select(".graphics")

  const circle = graphics.select("circle")

  const radius = graphics.append("line")

  const indicator = graphics.selectAll(".indicator")

  const point = graphics.append("circle")

  const wave = g.append("g").attr("fill", "none")


  // 定义缩放行为，为zoom事件设置事件处理器
  let zoom = d3.zoom().on("zoom", function (event) {
    // 关键信息是event.transform，表示变换状态
    // console.log('event:', event);
    // 当前作用域this为触发事件的元素，比如svg
    // console.log('zoom this:', this);

    // 为svg元素添加变换是不合理的
    // svg.attr("transform",event.transform)

    // 为最顶层级的组设置变换
    g.attr("transform", event.transform)
    const {x, y, k} = event.transform
    // axes.attr("transform", `translate(${x},${y})`)
  })

  // 对g元素使用时，即是对g中所有的元素应用，（鼠标应对准图形元素）
  // 对svg元素使用时，在空白区域也有效
  svg.call(zoom)
})


watch([time, r, d], (value, oldValue) => {

})

const vectorList = (cs) => {
  cs.forEach((value, index) => {
    `(${cs[index]})*e^(${index % 2 === 0 ? -index / 2 : (index + 1) / 2}*i*t)`
  }).reduce((a, b) => {

  })

}
</script>

<style scoped>

</style>