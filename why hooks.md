
1. 统一
hooks 可以减少写react应用中的概念，减少代码量。让你总是使用函数，而不是在函数，类，高阶函数和render props中切换。

只用组合起来的函数。

> Choosing to use stateless functional components removes the trade-offs that come with idiomatic JavaScript classes, such as boilerplate constructor initialization and binding functions to components for its methods to have access to this in the component instance

react最大的优点之一就是`declarative nature`。setState其实是偏离了这个核心特性的。hooks就遵从了这个特性。

> Imperative programming: telling the "machine" how to do something, and as a result what you want to happen will happen. Declarative programming: telling the "machine"1 what you would like to happen, and let the computer figure out how to do it.

2. 在context中分享状态（一个激进的观点）
React is its own state management library。hooks可以代替redux，全局管理data。

`const CountContext = React.createContext({})`

![timer with useContext](https://miro.medium.com/max/700/1*vpGY685zbMFa6r76tUa1Gg.png)

这比起使用`render prop`来读取context值是一大进步，可以方便地看出组件到底用到了哪些context。

3. sharing non-visual logic

allows us to extract stateful logic t a simple js function and share it.

其实就是写一个useX, custom hooks

# in closing...

✔️ How we managing state has become easier to reason about
✔️ Our code is significantly simplified, and more readable
✔️ It’s easier to extract and share stateful logic in our apps.
