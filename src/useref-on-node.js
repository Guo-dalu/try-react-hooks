import React, { useState, useRef, useEffect } from "react"
import Button from "@material-ui/core/Button"
// import Divider from "@material-ui/core/Divider"

function Example() {
  const [height, setHeight] = useState(0)
  const [hasRect, setHasRect] = useState(false)
  const measuredRef = useRef(null)

  useEffect(() => {
    const node = measuredRef.current
    console.log("----- before", node)
    if (node) {
      setHeight(node.getBoundingClientRect().height)
    } else {
      setHeight(333)
    }
    console.log("--- after", node)
  }, [hasRect])

  return (
    <>
      {console.log({ height }, "----render")}
      <Button
        onClick={() => {
          setHasRect(!hasRect)
        }}
      >
        click to toggle h1
      </Button>
      <p>The above header is {Math.round(height)}px tall</p>
      {hasRect ? <h1 ref={measuredRef}>Hello, world</h1> : ""}
    </>
  )
}

export default Example
