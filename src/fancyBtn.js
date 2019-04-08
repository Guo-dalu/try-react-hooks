import React from 'react'

const FancyBtn = (props) => {
  console.log(props)
  return (
    <button onClick={props.onClick} style={{background: 'blue', color: 'white'}}>{props.children}</button>
  )

}

export default FancyBtn