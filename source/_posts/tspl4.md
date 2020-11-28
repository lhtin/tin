---
title: The Scheme Programming Language 摘抄笔记及习题答案
date: 2017/02/04
tag:
- scheme
category:
- note
excerpt: 本文为我阅读TSPL4的笔记和习题答案记录
---

## Preface

Scheme 由 Gerald J. Sussman 和 Guy L. Steele Jr. 发明，支持 lexical scoping、first-class procedures 和 continuations。

本书的目标是提供关于 Scheme 编程语言（R6RS 标准）的介绍。

## 1. Introduction

> Scheme is a call-by-value language, but for at least mutable (objects that can be modified), the values are pointers to the actual storage.

> At the heart of the Scheme language is a small core of syntactic forms from which all other forms are built. These core forms, a set of extended syntactic forms derived from them, and a set of primitive procedures make up the full Scheme language.

> To support lexical scoping, a procedure carries the lexical context (environment) along with its code.

### 1.1. Scheme Syntax

> Scheme programs are made up of keywords, variables, structured forms, constant data (numbers, characters, strings, quoted vectors, quoted lists, quoted symbols, etc.), whitespace, and comments.

> Keywords, variables, and symbols are collectively called identifiers. Identifiers may be formed from letters, digits, and certain special characters, including ?, !, ., +, -, *, /, <, =, >, :, $, %, ^, &, _, ~, and @, as well as a set of additional Unicode characters.

> A good rule is to use short identifiers when the scope of the identifier is small and longer identifiers when the scope is larger.

> Structured forms and list constants are enclosed within parentheses, e.g., (a b c) or (* (- x 2) y).

> Strings are enclosed in double quotation marks, e.g., "I am a string". Characters are preceded by #\, e.g., #\a.

comments: `; single line`, `#| block |#`, `#;(datum commnet)`

### 1.2. Scheme Naming Conventions

### 1.3. Typographical and Notational Conventions


## 2. Getting Started

### 2.1. Interacting with Scheme

### 2.2. Simple Expressions

> The `quote` (`'`) forces the list to be treated as data.

> Symbols and variables in Scheme are similar to symbols and variables in mathematical expressions and equations. When we evaluate the mathematical expression 1 - _x_ for some value of _x_, we think of _x_ as a variable. On the other hand, when we consider the algebraic equation _x_^2 - 1 = (_x_ - 1)(_x_ + 1), we think of _x_ as a symbol (in fact, we think of the whole equation symbolically). Just as quoting a list tells Scheme to treat a parenthesized form as a list rather than as a procedure application, **quoting an identifier tells Scheme to treat the identifier as a symbol rather than as a variable**.

> Numbers and strings may be quoted, too. Numbers and strings are treated as constants in any case, however, so quoting them is unnecessary.

### 2.3. Evaluating Scheme Expressions

> Constant objects, procedure applications, and quote expressions are only three of the many syntactic forms provided by Scheme. Fortunately, only a few of the other syntactic forms need to be understood directly by a Scheme programmer; these are referred to as core syntactic forms. The remaining syntactic forms are syntactic extensions defined, ultimately, in terms of the core syntactic forms.

### 2.4. Variables and Let Expressions

每一个 variable 都有它的 scope，同名的 variable，更里面的 variable 会 shadow 外层的 variable。这种 scope 叫做 lexical scoping。

```scheme
(let ((var expr) ...) body1 body2 ...)
```

### 2.5. Lambda Expressions

```scheme
(lambda (var ...) body1 body2 ...)
(lambda var body1 body2 ...)
(lambda (var ... var . var) body1 body2 ...)
```

### 2.6. Top-Level Definitions

### 2.7. Conditional Expressions

> A predicate is a procedure that answers a specific question about its arguments and returns one of the two values #t or #f.

### 2.8. Simple Recursion

> Recursion is a simple concept: the application of a procedure from within that procedure. It can be tricky to master recursion at first, but once mastered it provides expressive power far beyond ordinary looping constructs.

**mapping**: 映射

### 2.9. Assignment

> Although many programs can be written without them, assignments to top-level variables or let-bound and lambda-bound variables are sometimes useful. Assignments do not create new bindings, as with let or lambda, but rather change the values of existing bindings. Assignments are performed with set!.

## 3. Going Further

### 3.1. Syntactic Extension

> The core syntactic forms include top-level `define` forms, constants, variables, procedure applications, `quote` expressions, `lambda` expressions, `if` expressions, and `set!` expressions.

core grammar:

```
<program> -> <form>*
<form> -> <definition> | <expression>
<definition> -> <variable definition> | (begin <definition>*)
<variable definition> -> (define <variable> <expression>)
<expression> -> <constant>
             |  <variable>
             |  (quote <datum>)
             |  (lambda <formals> <expression> <expression>*)
             |  (if <expression> <expression> <expression>)
             |  (set! <variable> <expression>)
             |  <application>
<constant> -> <boolean> | <number> | <character> | <string>
<formals> -> <variable>
          |  (<variable>*)
          |  (<variable> <variable>* . <variable>)
<application> -> (<expression> <expression>*)

<variable> is any Scheme identifier
<datum> is any Scheme object, such as a number, list, symbol, or vector
<boolean> is either #t or #f
<number> is any number
<character> is any character
<string> is any string
```

### 3.2. More Recursion

> In a `letrec` expression, `expr ...` are most often `lambda` expressions, though this need not be the case. One restriction on the expressions must be obeyed, however. It must be possible to evaluate each `expr` without evaluating any of the variables `var ...`.

### 3.3. Continuations

> During the evaluation of a Scheme expression, the implementation must keep track of two things: (1) what to evaluate and (2) what to do with the value. We call "what to do with the value" the continuation of a computation.

对 continuation 的记录，意味着下次使用该 continuation 时会回到之前计算的某个点，再往下走。也就是说可以回到过去。


### 3.4. Continuation Passing Style

使函数调用的隐式 continuation 通过 CPS 转换变为显式。

使用场景：

1. 是函数调用可以返回多个值
2. 可以传入多个 continuation

### 3.5. Internal Definitions

> Definitions may also appear at the front of a lambda, let, or letrec body, in which case the bindings they create are local to the body.

### 3.6. Libraries

用于模块化，只暴露必要的内容给使用者。

```scheme
(library (lib-name)
  (export x1 x2 ...)
  (import (rnrs))
  ...)
```

## 4. Procedures and Variable Bindings

### 4.1. Variable References

> Since the scope of the definitions in a `library`, top-level program, `lambda`, or other local body is the entire body, it is not necessary for the definition of a variable to appear before its first reference appears, as long as the reference is not actually evaluated until the definition has been completed.

### 4.2. Lambda

`(lambda formals body1 body2 ...)`

### 4.3. Case-Lambda

> The `case-lambda` syntactic form directly supports procedures with optional arguments as well as procedures with fixed or indefinite numbers of arguments.

`(case-lambda clause ...)`

`clause`:
`[formals body1 body2 ...]`

### 4.4. Local Binding

`let`, `let*`, `letrec`, `letrec*`

### 4.5. Multiple Values

`let-values`, `let*-values`

### 4.6. Variable Definitions

`define`

> A set of definitions may be grouped by enclosing them in a `begin` form. Definitions grouped in this manner may appear wherever ordinary variable and syntax definitions may appear. They are treated as if written separately, i.e., without the enclosing `begin` form.

### 4.7. Assignment

`set!`

## 5. Control Operations

### 5.1. Procedure Application

> Procedure application is the most basic Scheme control structure. Any structured form without a syntax keyword in the first position is a procedure application.

`(apply procedure obj ... list)`

> `apply` is useful when some or all of the arguments to be passed to a procedure are in a list, since it frees the programmer from explicitly destructuring the list.

### 5.2. Sequencing

`(begin expr1 expr2 ...)`

> The bodies of many syntactic forms, including `lambda`, `case-lambda`, `let`, `let*`, `letrec`, and `letrec*`, as well as the result clauses of `cond`, `case`, and `do`, are treated as if they were inside an implicit `begin`; i.e., the expressions making up the body or result clause are executed in sequence, with the values of the last expression being returned.

### 5.3. Conditionals

`if`, `not`, `and`, `or`, `cond`, `when`, `unless`, `case`

### 5.4. Recursion and Iteration

`(let name ((var expr) ...) body1 body2 ...)`

`(do ((var init update) ...) (test result ...) expr ...)`

### 5.5. Mapping and Folding

`(map procedure list1 list2 ...)`
`(for-each procedure list1 list2 ...)`

> `for-each` is similar to `map` except that `for-each` does not create and return a list of the resulting values, and `for-each` guarantees to perform the applications in sequence over the elements from left to right.

`(exists procedure list1 list2 ...)`
`(for-all procedure list1 list2 ...)`

`exists` 和 `for-all` 的区别在于前者是在调用函数返回 `#t` 是结束，后者是在返回 `#f` 是结束。

`(fold-left procedure obj list1 list2 ...)`
`(fold-right procedure obj list1 list2 ...)`

### 5.6. Continuations

用一句比较玄的话来讲就是：它（Continuation）可以去到未来，也可以回到过去。

`(call/cc procedure)`
`(dynamic-wind in body out)`

`dynamic-wind` 还需要再思考清楚。

### 5.7. Delayed Evaluation

> The benefit of using `delay` and `force` is that some amount of computation might be avoided altogether if it is delayed until absolutely required. Delayed evaluation may be used to construct conceptually infinite lists, or streams.

### 5.8. Multiple Values

`(call-with-values producer consumer)`

### 5.9. Eval

> Scheme's `eval` procedure allows programmers to write programs that construct and evaluate other programs. This ability to do run-time meta programming should not be overused but is handy when needed.

`(eval obj environment)`
`(environment import-spec ...)`


## 6. Operations on objects

> This chapter describes the operations on objects, including lists, numbers, characters, strings, vectors, bytevectors, symbols, booleans, hashtables, and enumerations.

### 6.1. Constants and Quotation

`quote`, `quasiquote`, `unquote`, `unquote-splicing`

### 6.2. Generic Equivalence and Type Predicates

> `eq?` is most often used to compare symbols or to check for pointer equivalence of allocated objects

`eq?`, `eqv?`, `equal?` 三者的区别在于后者比前者能判断的更加广泛。

### 6.3. Lists and Pairs

`(list '+)` 与 `(list +)` 的区别在于，第一个 list 包含的是符号 symbol +，而第二个 list 包含的是程序 procedure +。

也就是说， list 的内容可以包含任意类型的值，包括 procedure。

注意 `'(a b c)` 表示含有 symbol `a` 、 `b` 和 `c` 的 list，而不是一个叫 `(a b c)` 的 symbol。

### 6.4. Numbers

> Scheme numbers may be classified as integers, rational numbers, real numbers, or complex numbers. This classification is hierarchical, in that all integers are rational, all rational numbers are real, and all real numbers are complex.

> A Scheme number may also be classified as exact or inexact, depending upon the quality of operations used to derive the number and the inputs to these operations.

### 6.5. Fixnums

fixnum 指固定范围内的整数。

### 6.6. Flonums

### 6.7. Characters

### 6.8. Strings

### 6.9. Vectors

> Vectors are more convenient and efficient than lists for some applications. Whereas accessing an arbitrary element in a list requires a linear traversal of the list up to the selected element, arbitrary vector elements are accessed in constant time.

### 6.10. Bytevectors

> Bytevectors are vectors of raw binary data.

### 6.11. Symbols

> The property that two symbols may be compared quickly for equivalence makes them ideally suited for use as identifiers in the representation of programs, allowing fast comparison of identifiers.

### 6.12. Booleans

### 6.13. Hashtables

> Hashtables represent sets of associations between arbitrary Scheme values. They serve essentially the same purpose as association lists but are typically much faster when large numbers of associations are involved.

### 6.14. Enumerations

## 7. Input and Output

> All input and output operations are performed through ports.

> Ports are first-class objects, like any other object in Scheme.

### 7.1. Transcoders

### 7.2. Opening Files

> It is perhaps easier to imagine that the default file options are the imaginary option symbols `create`, `fail-if-exists`, and `truncate`; `no-create` removes `create`, `no-fail` removes `fail-if-exists`, and `no-truncate` removes `truncate`.

### 7.3. Standard Ports

### 7.4. String and Bytevector Ports

### 7.5. Opening Custom Ports

### 7.6. Port Operations

### 7.7. Input Operations

### 7.8. Output Operations

### 7.9. Convenience I/O

### 7.10. Filesystem Operations

### 7.11. Bytevector/String Conversions

## 8. Syntactic Extension

> Syntactic extensions, or macros, are used to simplify and regularize repeated patterns in a program, to introduce syntactic forms with new evaluation rules, and to perform transformations that help make programs more efficient.

> Syntactic extensions are expanded into core forms at the start of evaluation (before compilation or interpretation) by a syntax expander.

### 8.1. Keyword Bindings

```scheme
(define keyword expr)
(let-syntax ((keyword expr) ...) form1 form2 ...)
(letrec-syntax ((keyword expr) ...) form1 form2 ...)
```

### 8.2. Syntax-Rules Transformers

> P is of the form (P1 ... Pn) and F is a list of n elements that match P1 through Pn

上面一句话的意思如果模式 P 是 `(p1 p2 p3 p4)` 这样子的格式的话，则 F 也必须是包含 4 个元素的列表。这里的 `...` 表示的是确定的指定了 n 个子模式。而不是在模式出现 `...` 这个标识符。表示模式中出现 `...` 标识符是通过下面中提到的标识符 `ellipsis` 来指代的。注意这里容易造成混淆。

```scheme
(let ([if #f])
  (let ([t 'okay])
    (or if t)))
```

扩展为：

```scheme
((lambda (if1)
   ((lambda (t1)
      ((lambda (t2)
         (if t2 t2 t1))
       if1))
    'okay))
 #f)
```

### 8.3. Syntax-Case Transformers

> With this mechanism (`syntax-case`), transformers are procedures of one argument. The argument is a syntax object representing the form to be processed. The return value is a syntax object representing the output form. A syntax object may be any of the following.

> `#'template` is equivalent to `(syntax template)`. The abbreviated form is converted into the longer form when a program is read, prior to macro expansion.

> Syntactic extensions ordinarily take the form `(keyword subform ...)`, but the `syntax-case` system permits them to take the form of singleton identifiers as well.


`(with-syntax ((pattern expr) ...) body1 body2 ...)`

理解：这里理解的重点是 `pattern`，其实和 `syntax-case` 中的 `pattern` 一致。用于解构 `expr` 的值。且看下面的示例：

```scheme
(define-syntax lab
  (lambda (x)
    (syntax-case x ()
      [(_ e1 e2)
       (with-syntax ([(_ x1 x2) #'e1]
                     [(_ y1 y2) #'e2])
         #'(+ x1 x2 y1 y2))])))
```

> `quasisyntax` can be used in place of `with-syntax` in many cases.

值得思考 `(datum->syntax template-identifier obj)` 的作用。

关于本章的语法扩展问题，需要多思考作用域相关的问题。


## 9. Records

### 9.1. Defining Records

注意每次定义 record type ，即使名字一样，也是不同的。

### 9.2. Procedural Interface


## 10. Libraries and Top-Level Programs

学习 Scheme 库的建立。

### 10.1. Standard Libraries

### 10.2. Defining New Libraries

### 10.3. Top-Level Programs

> Top-level programs can be thought of as `library` forms without the library wrapper, library name, and export form.


## 11. Exceptions and Conditions

> Exceptions and conditions provide the means for system and user code to signal, detect, and recover from errors that occur when a program is run.

### 11.1. Raising and Handling Exceptions

### 11.2. Defining Condition Types

### 11.3. Standard Condition Types

## 12. Extended Examples

### 12.1. Matrix and Vector Multiplication

### 12.2. Sorting

### 12.3. A Set Constructor

### 12.4. Word Frequency Counting

### 12.5. Scheme Printer

### 12.6. Formatted Output

## 总结

重点是前三章的内容，值得多读几遍。另外第十二章的示例还差几个没有看完。其余章节都浏览了一遍。之后需要查阅相关的内容时，请在索引页面搜索。


## Exercise

2.2.1

a. (+ (* 1.2 (- 2 1/3) -8.7))
b. (/ (+ 2/3 4/9) (- 5/11 -4/3))
c. (+ 1 (/ 1 (+ 2 (/ 1 (+ 1 1/2)))))
d. (* 1 -2 3 -4 5 -6 7)

2.2.2

complex numbers
real numbers
rational numbers
integers

2.2.3

```
a. (car cdr)
b. (this ((is silly)))
c. (is this silly?)
d. (+ 2 3)
e. (+ 2 3)
f. +
g. (2 3)
h. #<procedure cons>
i. cons
j. (quote cons)
k. quote
l. 5
m. 5
n. 5
o. 5
```

2.2.4

```
(car (car '((a b) (c d)))) => a
(car (cdr (car '((a b) (c d))))) => b
(car (car (cdr '((a b) (c d))))) => c
(car (cdr (car (cdr '((a b) (c d)))))) => d
```

2.2.5

```
'((a . b) ((c) d) ())
```

2.2.6

```
(1 (2 (3)) (()) 4 . 5)
```

2.2.8

试着解释 Scheme 表达式是如何求值。

答：先递归求值每个操作数，然后将得到的值应用到操作符上。

2.3.1

```
(cdr (list + - * /)) => (list - * /)
(car (list - * /)) => -
(- 17 5) => 12
```

2.4.1

a.
```scheme
(let ([x (* 3 a)])
  (let ([y1 (- x b)]
        [y2 (+ x b)])
    (+ y1 y2)))
```

b.
```scheme
(let ([ls (list a b c)])
  (let ([x1 (car ls)]
        [x2 (cdr ls)])
    (cons x1 x2)))
```

2.4.3

a.

```scheme
(let ([x1 'a] [y1 'b])
  (list (let ([x2 'c]) (cons x2 y1))
        (let ([y2 'd]) (cons x1 y2))))
```

b.
```scheme
(let ([x1 '((a b) c)])
  (cons (let ([x2 (cdr x1)])
          (car x2))
        (let ([x3 (car x1)])
          (cons (let ([x4 (cdr x3)])
                  (car x4))
                (cons (let ([x5 (car x3)])
                        x5)
                      (cdr x3))))))
```

2.5.1

a. 'a
b. '(a)
c. 'a
d. '()

2.5.2

```scheme
(define list
  (lambda ls ls))
```

2.5.3

a. empty
b. +
c. f
d. f, y
e. y

2.6.2

```scheme
(define compose
  (lambda (p1 p2)
    (lambda (x)
      (p1 (p2 x)))))

(define cadr (compose car cdr))
(define cddr (compose cdr cdr))
```

2.6.3

```scheme
(define caar (compose car car))
(define cdar (compose cdr car))

(define caaar (compose caar car))
(define caadr (compose caar cdr))
(define cadar (compose cadr car))
(define cdaar (compose cdar car))

(define cdddr (compose cddr cdr))
(define cddar (compose cddr car))
(define cdadr (compose cdar cdr))
(define caddr (compose cadr cdr))

(define caaaar (compose caaar car))
(define caaadr (compose caaar cdr))
(define caadar (compose caadr car))
(define cadaar (compose cadar car))
(define cdaaar (compose cdaar car))

(define caaddr (compose caadr cdr))
(define cadadr (compose cadar cdr))
(define cdaadr (compose cdaar cdr))
(define caddar (compose caddr car))
(define cdadar (compose cdadr car))
(define cddaar (compose cddar car))

(define cddddr (compose cdddr cdr))
(define cdddar (compose cdddr car))
(define cddadr (compose cddar cdr))
(define cdaddr (compose cdadr cdr))
(define cadddr (compose caddr cdr))
```

2.7.1

```scheme
(define atom?
  (lambda (x)
    (not (pair? x))))
```

2.7.2

```scheme
(define shorter
  (lambda (ls1 ls2)
    (if (> (length ls2) (length ls1))
        ls2
        ls1)))
```

2.8.1

交换 cons 的参数顺序将会导致复制的 tree 的每一个节点的子节点被调换。

2.8.3

```scheme
(define make-list
  (lambda (n obj)
    (if (= n 0)
        '()
        (cons obj (make-list (- n 1) obj)))))
```

2.8.4

```scheme
(define list-ref
  (lambda (ls idx)
    (if (= idx 0)
        (car ls)
        (list-ref (cdr ls) (- idx 1)))))
(define list-tail
  (lambda (ls idx)
    (if (= idx 0)
        ls
        (list-ref (cdr ls) (- idx 1)))))
```

2.8.5

```scheme
(define shorter?
  (lambda (ls1 ls2)
    (cond
      [(null? ls1) #t]
      [(null? ls2) #f]
      [else (shorter? (cdr ls1) (cdr ls2))])))
(define shorter
  (lambda (ls1 ls2)
    (if (shorter? ls1 ls2)
        ls1
        ls2)))
```

2.8.6

```scheme
(define odd?
  (lambda (n)
    (if (= n 0)
        #f
        (even? (- n 1)))))
(define even?
  (lambda (n)
    (if (= n 0)
        #t
        (odd? (- n 1)))))
```

2.8.7

```scheme
(define transpose
  (lambda (ls)
    (let ([left (map car ls)]
          [right (map cdr ls)])
      (cons left right))))
```

2.9.1

```scheme
(define make-counter
  (lambda (init step)
    (let ([init init])
      (lambda ()
        (set! init (+ init step))
        init))))
```

2.9.2

```scheme
(define make-stack
  (lambda ()
    (let ([ls '()])
      (lambda (msg . args)
        (case msg
          [(empty?) (null? ls)]
          [(push!) (set! ls (cons (car args) ls))]
          [(top) (car ls)]
          [(pop!) (set! ls (cdr ls))]
          [else "oops"])))))
```

2.9.3

```scheme
(define make-stack
  (lambda ()
    (let ([ls '()])
      (lambda (msg . args)
        (case msg
          [(empty?) (null? ls)]
          [(push!) (set! ls (cons (car args) ls))]
          [(top) (car ls)]
          [(pop!) (set! ls (cdr ls))]
          [(ref) (list-ref ls (car args))]
          [(set!) (set-car! (list-tail ls (car args))
                            (cadr args))]
          [else "oops"])))))
```

2.9.4

```scheme
(define make-stack
  (lambda (n)
    (let ([vector (make-vector n)]
          [at 0])
      (lambda (msg . args)
        (case msg
          [(empty?) (= at 0)]
          [(push!) (begin
                     (vector-set! vector at (car args))
                     (set! at (+ at 1)))]
          [(top) (vector-ref vector (- at 1))]
          [(pop!) (set! at (- at 1))]
          [(ref)
           (let ([idx (- at 1 (car args))])
             (if (< idx 0)
                 (assertion-violation 'make-stack "out of range." idx)
                 (vector-ref vector idx)))]
          [(set!)
           (let ([idx (- at 1 (car args))])
             (if (< idx 0)
                 (assertion-violation 'make-stack "out of range." idx)
                 (vector-set! vector idx (cadr args))))]
          [else "oops"])))))
```

2.9.5

```scheme
(define make-queue
  (lambda ()
    (let ([end (cons 'ignored '())])
      (cons end end))))

(define emptyq?
  (lambda (q)
    (eq? (car q) (cdr q))))

(define putq!
  (lambda (q v)
    (let ([end (cons 'ignored '())])
      (set-car! (cdr q) v)
      (set-cdr! (cdr q) end)
      (set-cdr! q end))))

(define getq
  (lambda (q)
    (if (emptyq? q)
        (assertion-violation 'getq "queue is empty" q)
        (car (car q)))))

(define delq!
  (lambda (q)
    (if (emptyq? q)
        (assertion-violation delq "queue is empty" q)
        (set-car! q (cdr (car q))))))
```

2.9.6

```scheme
(define make-queue
  (lambda ()
    (let ([end '()])
      (cons end end))))

(define emptyq?
  (lambda (q)
    (and (null? (car q))
         (null? (cdr q)))))

(define putq!
  (lambda (q v)
    (let ([tail (cdr q)])
      (if (null? tail)
          (let ([body (cons v '())])
            (set-car! q body)
            (set-cdr! q body))
          (begin
            (set-cdr! tail (cons v '()))
            (set-cdr! q (cdr tail)))))))

(define getq
  (lambda (q)
    (if (emptyq? q)
        (assertion-violation 'getq "queue is empty" q)
        (car (car q)))))

(define delq!
  (lambda (q)
    (cond
      [(emptyq? q)
       (assertion-violation delq "queue is empty" q)]
      [(eq? (car q) (cdr q))
       (let ([empty '()])
         (set-car! q empty)
         (set-cdr! q empty))]
      [else
       (set-car! q (cdr (car q)))])))
```

2.9.8

```scheme
(define list?
  (lambda (x)
    (cond
      [(null? x) #t]
      [(and (pair? x)
            (have-cyclic? x x)) #f]
      [(pair? x) (list-help (cdr x))]
      [else #f])))

(define list-help
  (lambda (x)
    (cond
      [(null? x) #t]
      [(pair? x) (list-help (cdr x))]
      [else #f])))

(define have-cyclic?
  (lambda (hare tortoise)
    (cond
      [(not (pair? (cdr hare))) #f]
      [(not (pair? (cddr hare))) #f]
      [(eq? (cddr hare) (cdr tortoise)) #t]
      [else (have-cyclic? (cdr (cdr hare)) (cdr tortoise))])))
```

3.1.1

```scheme
(let ([x (memv 'a ls)])
  (and x (memv 'b x)))
;; =>
((lambda (x)
   (if x (and (memv 'b x)) #f))
 (memv 'a ls))
;; =>
((lambda (x)
   (if x (memv 'b x) #f))
 (memv 'a ls))
```

3.1.2

```scheme
(or (memv x '(a b c)) (list x))
;; =>
(if (memv x '(a b c))
    (memv x '(a b c))
    (or (list x)))
;; =>
(if (memv x '(a b c))
    (memv x '(a b c))
    (list x))
```

3.1.3

```scheme
(define-syntax let*
  (syntax-rules ()
    [(_ () b1 b2 ...)
     (let () b1 b2 ...)]
    [(_ ([x e]) b1 b2 ...)
     (let ([x e]) b1 b2 ...)]
    [(_ ([x1 e1] [x2 e2] ...) b1 b2 ...)
     (let ([x1 e1])
       (let* ([x2 e2] ...) b1 b2 ...))]))
```

3.1.4

```scheme
(define-syntax when ;; 如果对
  (syntax-rules ()
    [(_ test e1 e2 ...)
     (if test
         (begin e1 e2 ...)
         #f)]))
(define-syntax unless ;; 如果不对
  (syntax-rules ()
    [(_ test e1 e2 ...)
     (when (not test) e1 e2 ...)]))
```

3.2.2

the named `let`, beacuse it's more simple.

3.2.3

```scheme
(let xxx ([t 'even?] [x 20])
  (cond
    [(eq? t 'even?)
     (or (= x 0)
         (xxx 'odd? (- x 1)))]
    [(eq? t 'odd?)
     (and (not (= x 0))
          (xxx 'even? (- x 1)))]))
```

3.2.4

```scheme
(fibonacci 40)
```

1: 331160280次
2: 39次

3.2.5

```scheme
;; use set!
(define-syntax let
  (syntax-rules ()
    [(_ ((x e) ...) b1 b2 ...)
     ((lambda (x ...) b1 b2 ...) e ...)]
    [(_ name ((x e) ...) b1 b2 ...)
     (let ([name #f])
       (set! name (lambda (x ...) b1 b2 ...))
       (name e ...))]))
```

3.2.6

```scheme
(define even? ; incorrect!
  (lambda (x)
    (let ([a (= x 0)])
      (if a
          a
          (let ([b (odd? (- x 1))])
            (if b b #f))))))
(define even? ; correct!
  (lambda (x)
    (let ([a (= x 0)])
      (if a
          a
          (odd? (-x 1))))))
```

注意它们的区别：每次调用 `even?` 就多了一层 `let` 和 `if`

3.2.7

```scheme
(define factor
  (lambda (n)
    (let f ([n n] [i 3])
      (let-values ([(s r) (exact-integer-sqrt n)])
        (cond
          [(>= i s) (list n)]
          [(integer? (/ n 2))
           (cons 2 (f (/ n 2) i))]
          [(integer? (/ n i))
           (cons i (f (/ n i) i))]
          [else (f n (+ i 1))])))))
```

First is the most important problem to solve.

3.3.1

3.3.2

```scheme
(define product
  (lambda (ls)
    (let f ([ls ls] [c (lambda () 1)])
      (cond
        [(null? ls) (c)]
        [(= (car ls) 0) 0]
        [else (f (cdr ls) (lambda ()
                            (* (car ls) (c))))]))))
```

通过回调的形式返回。

3.3.3

```scheme
(define exit (call/cc (lambda (k) k)))
(define quit
  (lambda ()
    (if (null? lwp-list)
        (exit #f)
        (start))))
```

关键是定义一个退出的 continuation。

3.3.4

```scheme
(define lwp-list (make-queue))
(define lwp
  (lambda (thunk)
    (putq! lwp-list thunk)))
(define start
  (lambda ()
    (let ([p (getq lwp-list)])
      (delq! lwp-list)
      (p))))
```

3.3.5

3.4.1

```scheme
(define reciprocal
  (lambda (n success failure)
    (if (= n 0)
        (failure)
        (success (/ 1 n)))))
```

3.4.2

```scheme
(define retry #f)
(define factorial
  (lambda (x k)
    (if (= x 0)
        (begin
          (set! retry k)
          (k 1))
        (factorial (- x 1)
                   (lambda (n)
                     (k (* n x)))))))
```

3.4.3

```scheme
(define reciprocals
  (lambda (ls success failure)
    (let map1 [(ls ls) (ls2 '())]
      (cond
        [(null? ls)
         (success (reverse ls2))]
        [(= (car ls) 0)
         (failure "zero found")]
        [else (map1 (cdr ls) (cons (car ls) ls2))]))))
```

3.5.1

```scheme
(define-syntax complain
  (syntax-rules ()
    [(_ ek msg expr)
     (ek (list msg expr))]))
```

3.5.2

```scheme
(define calc
  (lambda (expr)
    ; grab an error continuation ek
    (call/cc
     (lambda (ek)
       (define do-calc
         (lambda (ek expr)
           (cond
             [(number? expr) expr]
             [(and (list? expr) (= (length expr) 3))
              (let ([op (car expr)] [args (cdr expr)])
                (case op
                  [(add) (apply-op ek + args)]
                  [(sub) (apply-op ek - args)]
                  [(mul) (apply-op ek * args)]
                  [(div) (apply-op ek / args)]
                  [else (complain ek "invalid operator" op)]))]
             [else (complain ek "invalid expression" expr)])))
       (define apply-op
         (lambda (ek op args)
           (op (do-calc ek (car args)) (do-calc ek (cadr args)))))
       (define complain
         (lambda (ek msg expr)
           (ek (list msg expr))))
       (do-calc ek expr)))))
```

3.5.3

```scheme
(define calc #f)
(let ()
  (define do-calc
    (lambda (expr)
      (cond
        [(number? expr) expr]
        [(and (list? expr) (= (length expr) 3))
         (let ([op (car expr)] [args (cdr expr)])
           (case op
             [(add) (apply-op + args)]
             [(sub) (apply-op - args)]
             [(mul) (apply-op * args)]
             [(div) (apply-op / args)]
             [else (assertion-violation 'do-calc "invalid operator" op)]))]
        [else (assertion-violation 'do-calc "invalid expression" expr)])))
  (define apply-op
    (lambda (op args)
      (op (do-calc (car args)) (do-calc (cadr args)))))
  (set! calc do-calc))
```

3.5.4

```scheme
...
       [(and (list? expr) (= (length expr) 2))
         (let ([op (car expr)] [arg (cadr expr)])
           (case op
             [(minus) (- (do-calc arg))]))]
...
```

3.6.1

```scheme
  (define-syntax gpa
    (syntax-rules ()
      [(_ g1 g2 ...)
       (let ([ls (map letter->number
                      (filter (lambda (g) (not (eq? g 'x)))
                            '(g1 g2 ...)))])
         (/ (apply + ls) (length ls)))]))
```

3.6.2

```scheme
...
  define count
    (lambda (g0 ls)
      (length (filter (lambda (g) (eq? g g0))
                      ls))))
  (define gs '(a b c d f))

  (define-syntax distribution
    (syntax-rules ()
      [(_ g1 g2 ...)
       (let ([ls '(g1 g2 ...)])
         (map list (map (lambda (g0) (count g0 ls))
                        gs)
              gs))]))
...
```

3.6.3

```scheme
...
  (define print-one
    (lambda (gn)
      (string-append
       "  "
       (symbol->string (cadr gn))
       ": "
       (make-string (car gn) #\*)
       "\n")))

  (define print
    (lambda (dist)
      (if (null? dist)
          ""
          (string-append (print-one (car dist))
                         (print (cdr dist))))))

  (define histogram
    (lambda (port dist)
      (put-string port "prints:\n")
      (put-string port
                  (print dist))))
...
```

12.2.1

使用 `(list (car ls))` 的原因是因为虽然此时 `n` 是 1，但是 `ls` 可能含有超过不只一个元素。如果直接返回 `ls`，就会导致结果不正确。

如果替换成 `(if (null? (cdr ls)) ls (list (car ls)))`，可以省去 `ls` 的初始长度那么多的空间。

12.2.2

假设有 `n` 个数字排列，则可以省略 `n` 个空间。
