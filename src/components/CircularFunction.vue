<template>
  <div id="circular"></div>
  <div style="position:fixed;left: 50%;top: 50px">
    <button>Play</button>
    <div>time:{{ time }}</div>
    <input type="range" v-model="time" min="0" max="10" step="0.01">

    <br/>
    <div>r:{{ r }}</div>
    <input type="range" v-model="r" min="0" max="10" step="0.01">
    <br/>
    <div>d:{{ d }}</div>
    <input type="range" v-model="d" min="0" max="10" step="0.01">
  </div>
</template>

<script setup>
import * as d3 from "d3";
import {onMounted, ref, watch, computed} from "vue";

const time = ref(0)
const r = ref(5)
const d = ref(r.value)
const p = computed(() => [r.value * Math.cos(time.value), -r.value * Math.sin(time.value)])
// 指示线的端点
const pts = computed(() => d3.pairs([[p.value[0], -d.value], p.value, [d.value, p.value[1]]]))
console.log('pts:', pts.value);

const WIDTH = innerWidth
const HEIGHT = innerHeight - 100

onMounted(() => {
  let svg = d3.select("#circular").append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)

  svg.append("circle")
      .attr("cx", 100)
      .attr("cy", 100)
      .attr("r", 100)
      .style("stroke", "wheat")
      .style("fill", "pink")

  let g = svg.append("g").attr("transform", `translate(${WIDTH / 2},${HEIGHT / 2})`)
  const xDomain = 12
  const xScale = d3.scaleLinear([-xDomain, xDomain], [-WIDTH / 2, WIDTH / 2]);
  const yDomain = Math.ceil(xScale.invert(HEIGHT / 2))
  const yScale = d3.scaleLinear([yDomain, -yDomain], [-HEIGHT / 2, HEIGHT / 2]);

  let xAxis = d3.axisBottom(xScale)
  let yAxis = d3.axisRight(yScale)

  let axes = g.append("g")
  axes.append("g").call(xAxis)
  axes.append("g").call(yAxis)


  const graphics = g.append("g")

      .attr("stroke", "black")

  const circle = graphics.append("circle")
      .attr("r", xScale(r.value))
      .attr("stroke", "gray")
      .attr("fill", "none")


  const radius = graphics.append("line").attr("id", "radius")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", xScale(p.value[0]))
      .attr("y2", xScale(p.value[1]))

  const indicator = graphics.selectAll(".indicator").data(pts.value)
      .join("line")
      .classed("indicator", true)
      .attr("x1", d => xScale(d[0][0]))
      .attr("y1", d => xScale(d[0][1]))
      .attr("x2", d => xScale(d[1][0]))
      .attr("y2", d => xScale(d[1][1]))

  const point = graphics.append("circle").attr("id", "p")
      .attr("r", 3)
      .attr("cx", xScale(p.value[0]))
      .attr("cy", xScale(p.value[1]))
      .attr("stroke", "gray")
      .attr("fill", "magenta")

  let cosWave = d3.line().x(d => xScale(d[0])).y(d => xScale(d[1]))
  let sinWave = d3.line().x(d => xScale(d[0])).y(d => xScale(d[1]))

  let tRange = d3.range(0, 10, 0.1)

  const wave = g.append("g").attr("fill", "none")
  wave.append("path").attr("d", cosWave(d3.zip(tRange.map(Math.cos), tRange)))
  wave.append("path").attr("d", sinWave(d3.zip(tRange, tRange.map(Math.sin))))

  const draw = () => {
    circle.attr("r", xScale(r.value))

    point.attr("cx", xScale(p.value[0]))
        .attr("cy", xScale(p.value[1]))

    radius.attr("x2", xScale(p.value[0]))
        .attr("y2", xScale(p.value[1]))

    indicator.data(pts.value)
        .join("line")
        .attr("x1", d => xScale(d[0][0]))
        .attr("y1", d => xScale(d[0][1]))
        .attr("x2", d => xScale(d[1][0]))
        .attr("y2", d => xScale(d[1][1]))
  }

  watch([time,r,d], (value, oldValue) => {

    draw()
  })

  // 定义缩放行为，为zoom事件设置事件处理器
  let zoom = d3.zoom().on("zoom", event => {
    // 关键信息是event.transform，表示变换状态
    // console.log('event:', event);
    // 当前作用域this为undefined
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

const vectorList = (cs) => {
  cs.forEach((value, index) => {
    `(${cs[index]})*e^(${index % 2 === 0 ? -index / 2 : (index + 1) / 2}*i*t)`
  }).reduce((a, b) => {

  })

}
</script>

<style scoped>

</style>