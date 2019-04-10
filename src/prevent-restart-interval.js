import React, { useState, useEffect } from "react"
// import Button from "@material-ui/core/Button"
// import fetchCat from "./utils/fetchCat"
// import Divider from "@material-ui/core/Divider"

function Example() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      console.log('---set count', id)
      setCount(count + 1) // This effect depends on the `count` state
    }, 1000)
    return () => clearInterval(id)
  }, [count]) // 🔴 Bug: `count` is not specified as a dependency

  return <h1>{count}{console.log(count, '---render')}</h1>
}

export default Example
