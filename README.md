react-hook的例子仓库。具体见src文件夹。

请配合[react-hook笔记](https://blog.csdn.net/github_36487770/article/details/88769758)食用

[toc]

**[文章中的例子戳这里看github](https://github.com/Guo-dalu/try-react-hooks)**

# hooks 的规则
- 只能在最高层级调用hooks，不能在循环， 条件或者嵌套方法中调用。
- 只能在函数组件中调用Hooks， 不能在普通的函数方法中调用（自定义Hook除外）。

**hooks是要能够重用stateful logic，即控制state的逻辑，而不是state本身。实际上，任何对hook的调用都会有完全独立的state，所以你甚至可以在一个组件中重用相同的组件Hook**


# setState

建议根据哪些值是一起变化的，将state拆分成多个小的state。而不是一上来就设一个大的复杂state。

```js
const [state, setState] = useState(initialState)

setState(currentState)
setState((prevState) => f(prevState))
```

- 接受一个值或者一个函数
- 是整个替换更新，而不是
自动Merge，需要解构自己merge(或者使用useReducer)
- 懒init 如果initialState需要通过复杂计算获得，可以提供一个函数

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props)
  return initialState
})
```
- 如果update的值跟之前的值相同，React可能会渲染组件本身，但不会渲染子组件和相关的effects。用Object.is来比较二者。
- 如果在渲染时有昂贵的计算，则用`useMemo`来优化

# useEffect

在函数式组件/render阶段中不允许有状态的改变，订阅，定时器，日志和其他引起副作用的方法。但可以使用`useEffect`来做这些事情。它与React类中的componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途，但整合到了单个的API中。

effect可以分为需要清理的和不需要清理的。网络请求，手动修改dom，和打印日志都属于常用的无需清理的effect。

- 为何useEffect要在组件内部调用？
  函数作用域问题。这样可以直接在effect中获取到state变量，而不需要一个额外的api去获取。这是js的闭包特性决定的。
- useEffect是不是在每次渲染之后都会运行？是的！默认是在第一次渲染和以后的每次更新都会跑，当然，可以通过传第二个参数来自定义它。与其用`mounting`, `updating`这样的术语来描述它，倒不如想成是effects会在每次`render`之后发生。React保证DOM在运行effects之前已经被更新了。

**useEffect(asyncFn, state)**
asyncFn会在render已经完成后执行。在纯函数的世界里，这是一个通往命令世界的逃生舱。
asyncFn需要返回一个清理side-effect的函数。该函数会在组件从UI中移除之前运行，以避免内存泄露。
async并不是指传入的第一个参数本身是async的，而是说里面可以声明一个async的函数，再执行它。

```js
useEffect(() => {
  const subscription = props.source.subscribe()
  return () => {
    subscription.unsubscirbe()
  }
})
```

## effects的时机
 为了避免在每次更新的时候都会清理上次、重新订阅，可以注意下effects的时机。不像`componentDidMount`和`componentDidUpdate`, 传给useEffect的函数在布局和绘制（layout and paint）之后被触发，处于一个被延迟的事件中。这样对许多订阅和事件监听都是适用的，但并非所有的effects都可以被稍后执行。例如，一个展现给用户看的DOM更新必须在下一次绘制的时候同步执行，对这类的effects, react提供了一个特别的hook，叫做`useLayoutEffect`。它有着与useEffect相同的函数签名，只是触发的时机不同。
 
 尽管useEffect会在浏览器绘制之后延迟触发，但是它一定会在下一次的render之前触发。

 ## 条件触发一次effect
 useEffect的函数接受第二个参数，一个数组，只有里面的值变动了，才会重新重新触发Effect函数。
 **确保数组中包括了组件的所有会随着时间改变，并被effect使用的props, state值**
- 如果只想触发一次和清理一次（mount and unmont），可以传一个空数组

# useContext

```js
const value = useContext(MyContext)
```
接受一个context对象（从React.createContext)中创建，并返回一个代表当前的context的值，这个值由最近的<MyContext.Provider>的value Prop决定。当该Provider更新的时候，这个hook就会触发一次重新渲染，会根据最近的一次传给MyContext的value属性变化。

useContext(MyContext) 基本与在class中static contextType = MyContext类似，或者类似于<MyContext.Consumer>

# useReducer
```js
const [state, dispatch] = useReducer(reducer, initialArg, init)
```
因为可以把dispatch方法传下去代替回调，对触发深层结构更新的组件会有效率上的优化
```js
const initialState = {count, 0}

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return {count: state.count +1}
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
    }
}

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  )
}
```
需要自己管理自己的状态，外部组件不需要知道里面组件的状态
> React没有像Redux一样直接使用`state = initailState`， 这是因为可能传入的inital value 是基于props的，所以没有从内部自己定义。

## 懒初始化
传入第三个参数, init函数，则初始值会被set 为 init(initialArg)。这样可以把计算初始state的逻辑从reducer中抽离出来，对根据action的结果重置state也非常方便。
```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

# useCallback

```js
const memoizedCallback = useCallback(() => { doSomething(a, b)}, [a, b])
```
a, b是依赖项。将会返回一个callback的记忆版本，只有当依赖项有改变时，才会改变。对根据引用相等进行了渲染优化后的子组件，传入callback很有效果。

useCallback(fn, deps) === useMemo(() => fn, deps)

# useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
传给useMemo的函数会在渲染时执行。后续react可能会遗忘掉一些不在页面上的组件的memo，重新计算它们。慎用。

# useRef
```js
const refContainer = useRef(initialValue)
```
返回一个可变的ref object，其.current属性由传入的参数初始化。返回的对象会在组件的生命周期内一直存在。
比如，明确命令式地获取一个child。
```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null)
  const onButtonClick = () => {
    inputEl.current.focus()
  }
  return (
    <>
      <input ref={inputEl} />
      <button onClick = {onButtonClick}>focus the input</button>
    </>
  )
}
```

# useImperativeHandle
useImperativeHandle(ref, createHandle, [dep1, dep2, ...])
生成一个自动focus的输入框子组件：
```js
function FancyInput(props, ref) {
  const inputRef = useRef()
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    }
  }))
  return <input ref={inputRef} ... />
}
FancyInput = forwardRef(FancyInput)
```

# useLayoutEffect
如果要把代码从class component迁移到函数式的，注意`useLayoutEffect`会在`componentDidMount`和`componentDidUpdate`的时候每次都触发。更推荐用useEffect.
如果使用了服务端渲染，注意无论是`useLayoutEffect`还是`useEffect`都会直到js被下载才会执行。

# useDebugValue
useDebugValue(value, (value) => computed(value))
用于在react dev tools中显示该label, 在定义customHoook 共享库的时候可以使用。第二个参数用于懒初始化。

# FAQ
1.
> hooks 会替代 render props 和 hoc 吗？
> 通常，render props和 hoc 都只能渲染一个子组件。但这二者仍然有独特的使用场景。比如说，一个虚拟的滚动组件，可能需要有`renderItem`prop，或者是一个有特定dom结构的容器组件。不过对大多数情况下，hook可以替代它们。

2.
> 组件的生命周期和hook是如何对应的？
> constructor在函数式组件中不存在，可以在`useState`中初始化state，如果计算初始state很耗费性能，可以传个函数给useState。getDerivedStateFromProps是通过每一次render执行更新的。shouldComponentUpdate 参见React.memo。render方法就是函数体本身。componentDidMount, componentDidUpdate, componentWillUnmount被useEffect包括在内。componentDidCatch, getDerivedStateFromError 暂时还没有等价的hook方法，但以后会被增加上。

3. 
> 有没有类似实例变量的东西？
> 有！useRef并不仅仅用于dom refs。ref对象是一个通用容器，其current属性是手动可变的，里面能放任何值，就像class上的实例属性一样。

```js
// component.js
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}

// 如果想在某个时间Handler上清理该interval，则可以这么做
function handleCancelClick() {
  clearInterval(intervalRef.current)
}
```
尽量不要在渲染的时候设置refs， 可能会导致意想不到的结果，最好是在事件处理和effect中修改refs。

4. 
> 是否可以只在更新的时候run effect?
> 这个用例很少见。不过若是需要，可以使用useRef中的可变ref来存一个布尔值，判断是否是第一次渲染，然后在effect里检查该值。 

5. 
> 如何拿到上一次的prop或者state？
```js
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  return (<h1>now: {count}, before: {prevCount}</h1>)
}
```
> 注意这里useEffect的时机，它是在render之后重新clean up 并执行的。其结果并不会触发重新render，因此能拿到上一次useEffect的结果。如果再在useEffect中setState，则会重新触发渲染，这样的话会render两次，就不能起到usePrevious的结果了。

6. 
> 为什么我在函数方法内部看到了未更新的prop或者state？
> 任何组件内的方法，包括事件handler和effects，都是从它被触发的那一刻render出的props和state中读取的值。
```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```
> 如果先点了alert按钮，再点了增加按钮，那么会看到alert出来的值是你点击那一刻时count的值。
> 另外一个可能的原因是错误地用了依赖项数组优化，比如传了一个空数组作为第二个参数，但又在内部获取了prop，那只能拿到最初的prop了。

7.
> 如何处理dom元素？
> 推荐用useCallback，也可以用useRef和useEffect结合，但是useCallback的话传入的第二个参数可以是一个空数组，避免重复渲染，而useEffect会多渲染一次，以确认前后值不变。例子参见usecallback-on-node.js和useref-on-node.js。 
```js
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

8. 
建议在`useEffect, useMemo, useCallback, useImperativeHandle`内部写定义的小函数，否则容易忘掉哪些依赖项。依赖项要包括用到的state, prop或者从这两者算出来的值。
```js
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }
    return () => { ignore = true };
  }, [productId]);
```
如果你就是不想把方法写在effect内部，考虑下别的选择：
- 把函数移到组件之外
- 如果这是一个纯计算函数，而且可以在渲染时安全地调用，可以在effect外部去调用，然后让返回值作为effect的依赖项之一。
- 最后，实在不行的话，还可以在effect依赖项中增加一个函数，但把它的定义包裹在useCallback中。这确保了不会在每次渲染的时候不会都去更新，只有在依赖项改变的时候才更新。例子参见update-outside-effect.js。

9. how to throttle render?
> 对setState采用函数式的更新，即传入一个函数，而不是一个值，从而尽可能去掉useEffect中的依赖项。这样做仍然会重新渲染和重新setState，但是不会重新调用setInterval之类的async函数。见例子prevent-restart-interval.js。
> 对比较复杂的情况，比如一个state依赖于另一个state，可以使用useReducer把更新state的逻辑提出来放在外面。[参见此文：https://adamrackis.dev/state-and-use-reducer/](https://adamrackis.dev/state-and-use-reducer/)useReducer的dispatch方法永远是稳定恒等的，即使组件内声明的reducer函数会用到props。
> 实在不行，那就用useRef替代useState来存取手动修改的变量吧！例子参见manually-render-useref.js

10. 如何应用shouldComponentUpdate?

把函数组件用React.memo包裹起来，即可浅比较传入的props。
```js
const Button = React.memo((props) => {
  // ...
})
```
这个跟hook没关系，React.memo基本等于PureComponent，但是它只比较Props。它还可以传入第二个参数，为一个比较函数。如果返回是true则会跳过udpate。

11. 如何记忆计算结果？

> `useMemo`hook 可以在多次渲染之间通过记住上次的计算结果完成缓存。注意传给useMemo的函数是在渲染时执行的。不要错误地把useEffect中该做的事情放在了useMemo中（useMemo有点像computed）。
> 可以用useMemo来做性能优化，但不能在语法上保证它的准确无误。
> 可以分别渲染两个子组件，但是，不能在循环中使用它，不过可以把list组件抽出来，然后调用useMemo。参见例子List.js。

12. hook在三个方面对shouldComponentUpdate做出的优化
- useCallback 可以在重新渲染之间维持着相同的callback引用，所以shouldComponentUpdate可以继续发挥功能。
- useMemo 可以让单独的子组件更新更容易
- 最后，useReducer可以降低往深层的子组件中传递回调的可能性。



