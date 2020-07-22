# MOOC Course: Programming Language

## Section 1

- syntax：定义如何写某个东西
- semantic：定义某个东西的意思，包括类型检查（type-checking）和执行（evaluation）
- variable binding: 绑定变量与值
- static environment: 变量与类型列表
- dynamic environment: 变量与值列表
- shadowing: 同名变量后面的绑定会屏蔽前面的绑定
- function：函数体是一个表达式，并且表达式里面依赖的内容必须在函数定义之前被定义
  - 语法：`fun f(var1:t1, ..., varn:tn)=e`
  - 类型：`t1 * ... * tn -> t`
- recursion：递归。将问题一步步分解缩小，直到不再需要分解就可以解决为止。
- function call：`e0(e1, ...)`
- tuples: pairs是2-tuples。
  - 语法：`(e1 * ... * en)`
  - 类型：`t1 * ... * tn`，t1到tn可以是任意类型
  - 提取：`#1 tuple`，提取结构中的第一个e1的值。`#2 tuple`，提取结构中的第二个e2的值
- lists：
  - 语法：`[e1, ..., en]`
  - 类型：`t list`，空列表为`'a list`
  - 检查：`null list`，是否为空
  - 提取：`hd list`，提取列表的第一个元素；`tl list`，除去列表的第一个元素的列表。
  - 添加：`e::list`，添加元素到列表的首位，e的类型必须跟列表中的元素一致
- let expression：
  - 语法：`let bindings in e end`
  - 类型：与e一致
  - 用处：定义local变量和函数，无须暴露于top-level
- options类型
  - `NONE`：`'a option`
  - `SOME e`：`type option`
  - `hasSome`：如果为`NONE`，返回false，如果为`SOME`，则返回true
  - `valOf`：如果为`SOME`，返回里面的值，如果为`NONE`，报错
- `andalso`、`orelse`、`not`
- comparisons：`=`、`<>`、`>`、`<`、`>=`、`<=`
- no mutation：不可修改性。
- 一门编程语言的组成部分
  - 语法（Syntax）
  - 语义（Semantics）
  - 套路（Idioms）
  - 库（Libraries）
  - 工具（Tools）
  - 本门课程就要学习**语义**和**套路**

## Section 2

- 组合类型
  - each of：`int * bool`
  - one of：`option int`
  - self reference：`int list`
- **records**：记录类型
  - 语法：`{foo=12+13,bar=true}`
  - 跟**tuples**比较起来：tuples通过位置访问元素，更简洁。records通过名称访问元素，更容易记忆。
- **tuples**是特殊的**records**
  - `(2,true,4)` 等于 `{1=2,2=true,3=4}`
  - 也就是说tuples只是records的syntactic sugar（语法糖）
- datatype bindings
  - syntax: `datatype mytype = TwoInts of int * int | Str of string | Pizza`
- case expression
  - syntax: `case x of Pizza => 3 | Str s => 8 | TwoInts(i1, i2) => i1 + i2`
- `type t = int * string`，则`t`等于`int * string`
- list和option都可以使用datatype定义
- `val pattern = expression`
  - `val (p1, p2) = (1,2)`
- `fun name pattern = expression`
  - `fun f {a=x,b=y} = x + y`
  - `f {a=3,b=4}`
  - 也就是说，ML里面的函数只有一个参数，所谓的多参数只是该函数接受一个tuple类型的参数而已。

