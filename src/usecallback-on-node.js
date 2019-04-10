import React, { useState, useCallback, } from "react"
import Button from "@material-ui/core/Button"
// import Divider from "@material-ui/core/Divider"

function Example() {
  const [height, setHeight] = useState(0)
  const [hasRect, setHasRect] = useState(false)

  const measuredRef = useCallback(node => {
    console.log('----- before', node)
    if (node) {
      setHeight(node.getBoundingClientRect().height)
    } else {
      setHeight(2222)
    }
    console.log('--- after', node)
  }, [])

  
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
