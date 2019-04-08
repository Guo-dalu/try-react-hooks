import React, { useState } from "react"
import Button from "@material-ui/core/Button"

let i = 0
const Zhen = () => {
  const [data, setData] = useState([])
  const handleClick = () => {
    let newData = data
    console.log(">", newData)
    newData.push(1)
    setData(newData)
  }
  return (
    <div className="container">
      {console.log("inner render---", data, i++)}
      <Button variant="contained" onClick={handleClick}>
        点我 8
      </Button>
      <br />

      <button variant="contained" onClick={handleClick}>
        点我 8
      </button>
    </div>
  )
}

export default Zhen
