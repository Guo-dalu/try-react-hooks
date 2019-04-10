import React, { useState, useEffect, useRef } from "react"
import Button from "@material-ui/core/Button"
// import fetchCat from "./utils/fetchCat"
// import Divider from "@material-ui/core/Divider"

function Example() {
  const count = useRef(0)
  const [, setIgnore] = useState(0)

  useEffect(() => {
    console.log('reset--count')
    count.current = 0}, [])

  useEffect(() => {
    function tick() {
      console.log("---set count", id, count.current)
      count.current += 1
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <h1 ref={count}>
        {count.current}
        {console.log(count, "---render")}
      </h1>
      <Button
        onClick={() => {
          setIgnore(count.current)
        }}
      >
        刷新
      </Button>
    </>
  )
}

export default Example
