import {computed, ref, watch, watchEffect} from "vue";
import {ceil, min, norm, pi, sum, round, floor} from "mathjs";
import {calcVectors, compileVectors, last, reIm} from "../fourierUtils";


// 周期为2π
const useEpicycles = (cs) => {
    // 时间参数
    const time = ref(0)
    const step = ref(0.1)

    const vectors = ref([])

    // 所有向量指向的坐标点的列表，即下一个圆的圆心
    const ps = ref([])
    // 最后一个向量指向的坐标点，
    const p = ref([])
    // 旋转向量的参考圆,{cx,cy,r}列表
    const circles = ref([])

    // 所有向量累加后的完整轨迹
    const cycleTrack = ref([])
    // 随时间显示的轨迹
    const track = ref([])

    watchEffect(() => {
        vectors.value = compileVectors(cs.value)

        // 计算完整轨迹
        cycleTrack.value=[]
        for (let i = 0; i < 4 * pi / step.value + 1; i++) {
            cycleTrack.value.push(reIm(sum(calcVectors(vectors.value, i * step.value))))
        }

    })

    const dist = ref(1.5)

    const cosPoints = ref([])
    const sinPoints = ref([])

    watchEffect(() => {
        ps.value = calcVectors(vectors.value, time.value)
            .map((_, index, arr) => sum(arr.slice(0, index + 1)))
            .map(reIm)
        ps.value = [[0, 0], ...ps.value]
        p.value = last(ps.value)
        circles.value = cs.value.map((c, index) => [ps.value[index], norm(c)])

        track.value = cycleTrack.value.slice(0, round(time.value / step.value + 1))

        cosPoints.value = []
        sinPoints.value = []
        for (let i = 0; i < round(time.value / step.value + 1); i++) {
            const [x, y] = cycleTrack.value[i ]
            const offset = time.value + dist.value - i * step.value
            cosPoints.value.push([x, offset])
            sinPoints.value.push([offset, y])
        }

    })


    return {
        time, step, ps, p, circles, track, cosPoints, sinPoints
    }
}

export {useEpicycles}
