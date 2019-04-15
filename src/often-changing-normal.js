import React, { useState, useCallback } from "react"
import Input from "@material-ui/core/Input"
import Card from "@material-ui/core/Card"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"

const Form = React.memo(({ handleSubmit }) => (
  <Card>
    <p>
      this is an expensive form lorem We recommend to pass dispatch down in
      context rather than individual callbacks in props. The approach below is
      only mentioned here for completeness and as an escape hatch. Also note
      that this pattern might cause problems in the concurrent mode. We plan to
      provide more ergonomic alternatives in the future, but the safest solution
      right now is to always invalidate the callback if some value it depends on
      changes
    </p>
    <Divider />
    <Button onClick={handleSubmit}>
      alert text {console.log("render form")}
    </Button>
  </Card>
))

function Example({ classes }) {
  // Note: `dispatch` won't change between re-renders
  const [text, updateText] = useState("")

  const handleChange = e => updateText(e.target.value)

  const handleSubmit = useCallback(
    () => {
      console.log("------ callback")
      alert(text)
    },
    [text]
  ) // Don't recreate handleSubmit like [text] would do

  return (
    <>
      {console.log("---- render")}
      <Input
        label="change it"
        value={text}
        onChange={handleChange}
        style={{ margin: "40px" }}
      />
      <Form handleSubmit={handleSubmit} />
    </>
  )
}

export default Example
