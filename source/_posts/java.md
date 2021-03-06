---
title: Java 笔记
date: 2017/03/15
tag:
- java
category:
- note
excerpt: 本文为我学习Java的笔记
---

阅读材料：

- [The Java Tutorials](http://docs.oracle.com/javase/tutorial/)

## Getting Started

### About the Java Technology

Java technology is both a programming language and a platform.

#### The Java Programming Language

Java 语言的特点: Simple, Architecture neutral, Object oriented, Portable, Distributed, High performance, Multithreaded, Robust, Dynamic, Secure. Each of the buzzwords explained in [The Java Language Environment](http://www.oracle.com/technetwork/java/langenv-140151.html)

`file.java` -- 由 javac 编译 -> `file.class`(bytecode) -- 由 Java VM 运行 -> 得到运行结果

[Java SE HotSpot at a Glance](Java SE HotSpot at a Glance)

#### The Java Platform

A *platform* is the hardware or software environment in which a program runs.

Java 平台是一个软件平台。

The Java platform has two components:

- The Java Virtual Machine
- The Java Application Programming Interface (API)

作为平台独立的运行环境，Java 平台比原生平台运行的更慢些。

### What can Java Technology Do?

### How Will Java Technology Change My Life?

## Learning the Java Language

### Object-Oriented Programming Concepts

#### What Is an Object?

对象由**状态(fields)**和相应的**行为(methods)**组成。是对真实世界中的物体的模拟。

面向对象编程的基础概念是**数据封装(data encapsulation)**，也就是说对象把自己的内部变量隐藏，只通过自己的方法和外界进行交互。

对象化所带来的好处：模块化、信息隐藏、代码复用、可插拔性和易于调试。

#### What Is a Class?

类是对象创建时所参考的蓝图，对象也可以叫做类的实例。

#### What Is Inheritance?

**继承**用于抽象不同类之间的相似之处，使类之间层次清楚，代码易读。

#### What Is an Interface?

对象通过**接口**与外界（其他对象）进行交互。

#### What Is a Package?

**包**是用于组织一系列相关**类**和**接口**的命名空间。

## Language Basics

### Variables

Java 中存在以下几种变量：

- **实例变量 (Instance Variables, Non-Static Fields)**
- **类变量 (Class Variables, Static Fields)**：使用 `static` 修饰符(modifiers)修饰的 fields
- **局部变量 (Local Variables)**
- **参数 (Parameters)**

### Primitive Data Types

> The Java programming language is statically-typed, which means that all variables must first be declared before they can be used. This involves stating the variable's type and name.

八种原始数据类型：`byte`(8-bit), `short`(16-bit), `int`(32-bit), `long`(64-bit), `float`(32-bit IEEE 754), `double`(64-bit IEEE 754), `boolean`, `char`(16-bit Unicode character).

```
int decVal = 26; // 十进制
int hexVal = 0x1a; // 十六进制
int binVal = 0b11010; // 二进制
```

### Array

```
int[] a = new int[10];

int[] b = {1, 2, 3, 4};

int[][] xy = {
    {1, 2},
    {2, 4},
    {3, 9}
}
```

### Operators

### Expressions, Statements, and Blocks

**语句**包括**表达式语句**、**声明语句**、**流程控制语句**。

### Constrol Flow Statement

常见流程控制语句：`if-then`, `switch`, `while`, `do-while`, `for`.

## Classes and Objects

### Classes

#### Declaring Member Variables

字段**访问修饰符**(Access Modifiers)：

- `public`：所有类都可以访问
- `private`：只能字段所属类访问

#### Defining Methods

方法**重载**(overloading)

> Note: Overloaded methods should be used sparingly, as they can make code much less readable.

#### Providing Constructors for Your Classes

如果没有给类提供**构造器**，Java 编译器会自动补加一个默认的构造器，该构造器会调用父类的无参构造器。因此，如果父类提供无参构造器，编译器将会报错。

形参(parameter)，实参(argument)。

#### Controlling Access to Members of a Class

**成员**(members)指类中的字段和方法，包括类成员和实例成员。

修饰符对成员的访问控制权限表：

Modifier      | Class | Package | Subclass | World
------------- | ----- | ------- | -------- | -----
`public`      | Y     | Y       | Y        | Y
`protected`   | Y     | Y       | Y        | N
*no modifier* | Y     | Y       | N        | N
`private`     | Y     | N       | N        | N

**修饰符**(modifier)使用时请遵循最严原则，也就是说优先使用 `private`，有理由使用其它修饰符除外。除了常量外，避免使用 `public` 修饰符。使用 `public` 修饰符会导致暴露过多的细节给类使用者，限制了类的具体实现，影响了之后修改代码的灵活性。

#### Understanding Class Members

类变量可以直接通过类访问到，而不需要先初始化。类方法也是如此，并且类方法的调用只建议从类上调用，而不要在实例上调用，方便和实例方法做区分。

类方法只能访问类变量和类方法，而实例方法可以访问实例变量、实例方法、类变量、类方法。

通过 `static` 和 `final` 修饰符定义常量。常量在编译成字节码之后，就固定不变了。也就是说，假如修改了某个类中的常量，其他使用这个常量的类也需要重现编译。

### Nested Classes

为什么要使用嵌套类：

- 对类进行逻辑上的分类：只在某个类中使用的类就声明在这个类里面
- 增加封装性：嵌套类可以访问包裹类中的所有成员
- 使代码易读和维护：代码上挨的更近

注：我觉得这几点还有待商榷。

嵌套类分为 Static Nested Classes 和 Inner Classes。

> Note: A static nested class interacts with the instance members of its outer class (and other classes) just like any other top-level class. In effect, a static nested class is behaviorally a top-level class that has been nested in another top-level class for packaging convenience.

方法中定义类(Local and Anonymous Classes)

### Lambda Expressions

> The operations filter, map, and forEach are *aggregate operations*.

注意，Lambda 表达式不会引入新的作用域，也就意味着在表达式中不能重复定义外面出现过的变量。

### When to Use Nested Classes, Local Classes, Anonymous Classes, and Lambda Expressions

### Enum Types

```
public enum Planet {
    MERCURY (3.303e+23, 2.4397e6),
    VENUS   (4.869e+24, 6.0518e6),
    EARTH   (5.976e+24, 6.37814e6),
    MARS    (6.421e+23, 3.3972e6),
    JUPITER (1.9e+27,   7.1492e7),
    SATURN  (5.688e+26, 6.0268e7),
    URANUS  (8.686e+25, 2.5559e7),
    NEPTUNE (1.024e+26, 2.4746e7);

    private final double mass;   // in kilograms
    private final double radius; // in meters
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }
    private double mass() { return mass; }
    private double radius() { return radius; }

    // universal gravitational constant  (m3 kg-1 s-2)
    public static final double G = 6.67300E-11;

    double surfaceGravity() {
        return G * mass / (radius * radius);
    }
    double surfaceWeight(double otherMass) {
        return otherMass * surfaceGravity();
    }
    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: java Planet <earth_weight>");
            System.exit(-1);
        }
        double earthWeight = Double.parseDouble(args[0]);
        double mass = earthWeight/EARTH.surfaceGravity();
        for (Planet p : Planet.values())
           System.out.printf("Your weight on %s is %f%n",
                             p, p.surfaceWeight(mass));
    }
}
```

## Annotations

**注解**(*annotation*)，给程序提供元数据，但不是程序的一部分。

作用：

- 给编译器提供信息
- 编译和部署时处理，生成代码，XML文件等
- 运行时处理

一些注解用于替代代码中的**注释**(*comment*)。

一些注解用于其他注解上面，称为**元注解**(*meta-annotation*)。

## Interfaces

**接口**(*interface*)是**引用类型**(*reference type*)，可以包含**抽象方法**(*abstract method*)、**默认方法**(*default method*)、**静态方法**(*static method*)、**常量**(*constant*)。

当需要扩充接口，但又不希望之前实现该接口的类进行修改时，可以通过定义默认方法或者静态方法来达到目的。

## Inheritance

子类**继承**(*inheritance**)父类中被 `public` 和 `protected` 修饰的成员(members)。如果子类和父类属于同一个 package，那么子类还继承了父类中的 *package-private* 成员。

作为所有类的祖先 Object 类（它自己没有父类了），它含有的以下方法会被继承：

- `protected Object clone() throws CloneNotSupportedException`
- `public boolean equals(Object obj)`
- `protected void finalize() throws Throwable`
- `public final Class getClass()`
- `public int hashCode()`
- `public String toString()`

### Polymorphism

**多态**(*polymorphism*)

> The Java virtual machine (JVM) calls the appropriate method for the object that is referred to in each variable. It does not call the method that is defined by the variable's type. This behavior is referred to as *virtual method invocation* and demonstrates an aspect of the important polymorphism features in the Java language.

## Packages

> Definition: A *package* is a grouping of related types providing access protection and name space management. Note that *types* refers to classes, interfaces, enumerations, and annotation types.

> For convenience, the Java compiler automatically imports two entire packages for each source file: (1) the java.lang package and (2) the current package (the package for the current file).

> Both the compiler and the JVM construct the path to your .class files by adding the package name to the *class path*.

## 泛型(Generics)

> In a nutshell, generics enable *types* (classes and interfaces) to be parameters when defining classes, interfaces and methods. Much like the more familiar *formal parameters* used in method declarations, type parameters provide a way for you to re-use the same code with different inputs. The difference is that the inputs to formal parameters are values, while the inputs to type parameters are types.

> Code that uses generics has many benefits over non-generic code:
>
> - Stronger type checks at compile time.
> - Elimination of casts.
> - Enabling programmers to implement generic algorithms.

动态指定类型，可以在类中，也可以在方法中。




