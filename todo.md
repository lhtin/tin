# Todo List

- 详解`JSON.stringfy`中的字符转义规则和`JSON.parse`中的字符还原规则。字符串字面量中的某些字符无法直接输入，需要通过某个规则的转义方式实现。
  ```js
  '\"' === '"'
  '\n' === 换行符
  var obj1 = {
    key1: 1
  }
  var obj2 = {
    id: 5,
    stringify1: JSON.stringify(obj1)
  }
  var stringify2 = JSON.stringify(obj2)
  var newObj2 = JSON.parse(stringify2)
  var newObj1 = JSON.parse(newObj2.stringify1)
  console.log('newObj1', newObj1)
  console.log('newObj2', newObj2)
  ```
