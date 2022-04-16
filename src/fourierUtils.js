// 傅里叶级数,产生编译的向量代码的列表
import {ceil, compile, complex, exp, im, multiply, pi, random, re, sum, mod, range} from "mathjs";

const compileVectors = (cs) => {
    const len = cs.length
    const p = ceil(len / 2)
    return cs.map((_, i) => i % 2 === 0 ? -i / 2 : (i + 1) / 2)
        .map((omega) => {
            const c = cs[mod(omega + len, len)]
            return compile(`(${c.toString()})*e^(${omega}*i*t)`)
        })
}
// 计算t时刻的向量列表
const calcVectors = (compileVectors, t) => compileVectors.map(code => code.evaluate({t}))

// 生成指定数量的随机复数
const randomComplexStr = (range = 1, length = 1) => Array.from({length},
    () => `(${random(-range, range)})+(${random(-range, range)})*i`)

const randomComplex = (range = 1, length = 1) => Array.from({length},
    () => complex(random(-range, range), random(-range, range)))

// 将复数转为平面坐标
const reIm = c => [re(c), im(c)]

const dft2 = (cs) => cs.map((_, omega) => sum(cs.map((val, i) => multiply(val, exp(complex(0, omega * 2 * pi * i / cs.length))))))

// 计算离散傅里叶变换
const dft = (cs) => cs.map((_, omega) => {
    const len = cs.length
    const temp = omega * 2 * pi / len
    const items = cs.map((val, i) => multiply(val, exp(complex(0, temp * i))))
    return multiply(1 / len, sum(items))
})

const last = (array) => array[array.length-1]

export {
    compileVectors,
    calcVectors,
    reIm,
    randomComplex,
    dft,
    last
}

