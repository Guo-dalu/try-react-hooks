如果直接在组件里改变了prop的第一层级的value，那么会报错，因为prop是const的。但如果一个Prop比如detail是对象，那么可以改变其属性。但是并不会触发页面的更新。这也是我们要极力避免的。

为什么redux需要immutable？

1. redux 和 react - redux 都使用的是浅比较来判断state改变了没有。combineReducers和connect方法都是在浅比较判断是否需要触发重新渲染
2. immutable数据更加安全
3. enable time-travel debugging。需要reducer是没有副作用的纯函数，所以可以安全地在不同state中穿梭。


不要去直接把object（包括array）赋给某个Prop，而是尽量深入内层更改primitive的值。


如果需要把state上的值（immutable）赋给 draft（mutable),  需要用castDraft 把state上的值转一下