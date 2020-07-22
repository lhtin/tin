# ES6

## `let`

```js
// case 1
{
    let i = i + 1;
    // ReferenceError: i is not defined
}
// case 2
{
    let i;
    i = i + 1;
    // 没报错，i 为 NaN
}
```

`let`声明的变量会被提升到语句块的顶部，顶部到声明之间的区域称为暂存死区（temporal dead zone），在暂存死区访问变量会报ReferenceError错误。声明时，未进行初始化的变量的值为`undefined`，可以理解为被隐式初始化了，这可以从上面的case 2得出。我觉得这个特效是语言设计上的问题，不应该对未显式初始化的变量进行隐式初始化，而应该在引用未显式初始化的变量时报变量未初始化的错误。也就是暂存死区延长到显式初始化之前的区域会更加合理。