import React, {  useMemo } from "react"
import breeds from "./utils/breeds"
import Divider from "@material-ui/core/Divider"
 

function Breed(breed) {
  return useMemo(() => (
      <li key={breed.name}>
      <h1>{breed.name}</h1>
      <p>{breed.description}</p>
      <Divider/>
      </li>
    ), [breed.description, breed.name])
}


function Example() {
  
  return (
    <ul>
    {breeds.map(breed => Breed(breed))
    }   
    </ul>
  )
}

export default Example
