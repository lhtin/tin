function getBestList (S2) {
  // 1. 将S2分成k个列表，时间复杂度O(nlogn)
  let levelList = [
    [S2[0]]
  ]
  for (let i = 1; i < S2.length; i += 1) {
    let x = S2[i]

    // 二分法查寻找刚好比x大的那个列表，
    let start = 0
    let end = levelList.length - 1
    // 中间位置
    let mid = Math.floor((start + end) / 2)
    // 中间位置对应的列表
    let level = levelList[mid]
    // 列表的最小值
    let min = level[level.length - 1]
    do {
      if (x < min) {
        // 如果当前元素小于中间列表的最后一个元素，
        // 说明x应该添加到start～mid中的某一个列表中
        // 所以缩小范围，从start～mid的列表中寻找
        end = mid
      } else {
        // 如果当前元素大于中间列表的最后一个元素，
        // 说明x不可能添加到start～mid中的任何一个列表中
        // 所以缩小范围，从mid+1～end的列表中寻找
        start = mid + 1
      }
      mid = Math.floor((start + end) / 2)
      level = levelList[mid]
      min = level[level.length - 1]
    } while (start < end)

    if (x < min) {
      // 如果停留在的那个列表的最后一个元素大于x，则将x添加到这个列表最后
      levelList[start].push(x)
    } else {
      // 如果大于，说明没有合适的列表可以添加x进去，则在后面新增一个列表并添加x
      levelList.push([x])
    }
  }

  // 2. 从这k个列表中获取最长子列表，时间复杂度O(n)
  let best = [
    levelList[levelList.length - 1][0] // 最后一个列表的第一个元素
  ]
  for (let i = levelList.length - 2; i >= 0; i -= 1) {
    let level = levelList[i]
    for (let j = 0; j < level.length; j += 1) {
      let x = level[j]
      if (x < best[best.length - 1]) {
        // 第一个小于之前找到的元素
        best.push(x)
        break
      }
    }
  }
  // 元素顺序要反转一下
  best.reverse()
  return best
}

let S1 = [0, 1, 2, 3, 4, 5]
let S2 = [5, 1, 3, 2, 0, 4]
let best = getBestList(S2)

console.log(`S1: ${S1}`)
console.log(`S2: ${S2}`)
console.log(`最长子列表为：${best}`)
console.log(`所以进行${S1.length - best.length}次移动可以将S1转换为S2：`)
let actions = []
for (let i = 0; i < S2.length; i += 1) {
  let x = S2[i]
  if (best.indexOf(x) === -1) {
    if (i === 0) {
      moveBefore(x, S2[i + 1], S1)
      actions.push(`将S1中的${x}移动到${S2[i + 1]}的前面：${S1}`)
    } else {
      moveAfter(x, S2[i - 1], S1)
      actions.push(`将S1中的${x}移动到${S2[i - 1]}的后面：${S1}`)
    }
  } else {
    actions.push(`${x}不需要移动`)
  }
}
actions.forEach((action) => {
  console.log(`  ${action}`)
})

function moveBefore (move, base, s) {
  let moveIndex = s.indexOf(move)
  let baseIndex = s.indexOf(base)
  if (moveIndex < baseIndex) {
    for (let i = moveIndex; i < baseIndex; i += 1) {
      s[i] = s[i + 1]
    }
    s[baseIndex - 1] = move
  } else {
    for (let i = moveIndex; i >= baseIndex; i -= 1) {
      s[i] = s[i - 1]
    }
    s[baseIndex] = move
  }
}
function moveAfter (move, base, s) {
  let moveIndex = s.indexOf(move)
  let baseIndex = s.indexOf(base)
  if (moveIndex < baseIndex) {
    for (let i = moveIndex; i <= baseIndex; i += 1) {
      s[i] = s[i + 1]
    }
    s[baseIndex] = move
  } else {
    for (let i = moveIndex; i > baseIndex; i -= 1) {
      s[i] = s[i - 1]
    }
    s[baseIndex + 1] = move
  }
}
