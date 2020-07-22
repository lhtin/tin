
const inputMax = document.getElementById('input-max')
const inputTimes = document.getElementById('input-times')
const log = document.getElementById('log')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

function f () {
  if (isPaused) {
    return
  }
  times += 1
  const S = []
  for (let i = 0; i < max; i += 1) {
    S.push({
      _index: i
    })
  }
  for (let i = 0; i < max; i += 1) {
    let j = Math.floor(Math.random() * max)
    let temp = S[i]
    S[i] = S[j]
    S[j] = temp
  }
  const start = performance.now()
  const {best, k} = getBestList(S)
  const diff = performance.now() - start
  list.push([diff, k])
  setTimeout(() => {
    inputTimes.value = times
    f()
  }, 1)
}

let list
let times
let isPaused = true
let max
startButton.addEventListener('click', () => {
    max = Number(inputMax.value)
    if (!isPaused || max <= 0) {
      return
    }
    isPaused = false
    list = []
    times = 0
    inputTimes.value = ''
    startButton.style.visibility = 'hidden'
    stopButton.style.visibility = 'visible'
    f()
  })
stopButton.addEventListener('click', () => {
    isPaused = true
    const t = list.reduce((a, b) => a + b[0], 0) / list.length
    const k = list.reduce((a, b) => a + b[1], 0) / list.length
    const timeStr = new Date().toLocaleString()
    log.innerHTML = `\
<hr>
<h6>${timeStr}</h6>
<pre>
  数量级：${Number(max).toLocaleString()}
  执行平均时间：${t.toLocaleString()} ms
  最长子序列平均长度：${k.toLocaleString()}
  执行次数：${times.toLocaleString()}
</pre>` + log.innerHTML

    console.groupCollapsed(timeStr)
    console.log(list)
    console.groupEnd()
    
    stopButton.style.visibility = 'hidden'
    startButton.style.visibility = 'visible'
  })

stopButton.style.visibility = 'hidden'
