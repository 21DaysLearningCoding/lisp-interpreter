# lisp-interpreter

难顶。

这是一个Lisp的解释器，是伯克利CS 16A SICP的大作业。我用了2天用JS写了一个lisp解释器，毕竟Python不太熟。

这个解释器支持如下功能
1. 基本数据类型（常数和浮点）

```bash
> 1
1
> 2.2
2.2
> (1.2)
1.2
```

2. 前缀表达式的四则运算
```bash
> (+ 1 (* 2 2 2) 5)
14
```

3. 定义变量

```bash
> (define a 10)
10
> a
10
> (+ 10 a)
20
```

4. 定义函数并执行函数

```bash
> (define (square x) (* x x))
Fn...
> (square 5)
25
> (define (doSth x) (define a 10) (+ a x))
Fn...
> (doSth 5)
15
> a
Unknown Expression....
```

5. 支持高阶函数

```bash
> (define (square way x) (way x))
Fn...
> (define (pow2 x) (* x x))
Fn...
> (square pow2 5)
25
```

6. 赋值语句

```bash
> (define a 10)
10
> (set! a 15)
15
> a
15
```

7. 闭包

```bash
> (define (amount balance) (define (withdraw x) (set! balance (- balance x))))
Fn...
> (define wd (amount 100))
Fn...
> (wd 20)
80
> (wd 20)
60
```

8. 选择语句

```bash
> (if (< 10 5) (define a 10) (define a 15))
15
> a
15
```

9. Lambda表达式

```bash
> (define (square way x) (way x))
Fn...
> (square (lambda (x) (* x x)) 5)
25
```