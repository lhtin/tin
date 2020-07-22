
function getBestList (S2) {
  // 1. 将S2分成k个列表，时间复杂度O(nlog(n))
  let levelList = [
    [S2[0]]
  ]
  for (let i = 1; i < S2.length; i += 1) { // n
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
    do { // log(n)
      if (x._index < min._index) {
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

    if (x._index < min._index) {
      // 如果停留在的那个列表的最后一个元素大于x，则将x添加到这个列表最后
      levelList[start].push(x)
    } else {
      // 否则，说明没有合适的列表可以添加x进去，则在后面新增一个列表并添加x
      levelList.push([x])
    }
  }

  // 2. 从这k个列表中获取最长子列表，时间复杂度O(n)
  let last = levelList[levelList.length - 1][0]
  let best = {
    [last._index]: last
  }
  for (let i = levelList.length - 2; i >= 0; i -= 1) {
    let level = levelList[i]
    for (let j = 0; j < level.length; j += 1) {
      let x = level[j]
      if (x._index < last._index) {
        // 第一个小于之前找到的元素
        best[x._index] = x
        last = x
        break
      }
    }
  }
  return {best, k: levelList.length}
}

function getFirstList (S2) {
  let list = {}
  let max = -1
  let count = 0
  for (let item of S2) {
    if (item._index > max) {
      list[item._index] = item
      max = item._index
      count += 1
    }
  }
  return {best: list, k: count}
}
