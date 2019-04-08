import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"

let i = 0

function Example() {
  const [count, setCount] = useState(0)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`
  })

  console.log("----> in outer", count, i++)

  return (
    <div className="container">
      {console.log("----> in inner", count, i++)}
      <p>You clicked {count} times</p>
      <Button variant="contained" onClick={() => setCount(count + 1)}>
        Click me
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setCount(23)}
      >
        set to 23
      </Button>
    </div>
  )
}

export default Example
