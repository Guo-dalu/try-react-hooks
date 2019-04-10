import React, { useState, useCallback, useEffect } from "react"
import Button from "@material-ui/core/Button"
import fetchCat from "./utils/fetchCat"
import Divider from "@material-ui/core/Divider"

function Example() {
  const [productId, setProductId] = useState(0)
  const [url, setUrl] = useState(null)

  // ✅ Wrap with useCallback to avoid change on every render
  const fetchProduct = useCallback(
    async () => {
      // ... Does something with productId ...
      const url = await fetchCat(productId)
      setUrl(url)
      
    },
    [productId]
  ) // ✅ All useCallback dependencies are specified

  return (
    <>
      <Button
        onClick={() => {
          setProductId(100 * Math.random())
        }}
      >
        get another pic
      </Button>
      <h2>productId: {productId}</h2>
      <Divider />
      <ProductDetails fetchProduct={fetchProduct} />
      <img alt="kitty" src={url}/>
    </>
  )
}

function ProductDetails({ fetchProduct }) {
  useEffect(
    () => {
      fetchProduct()
    },
    [fetchProduct]
  ) // ✅ All useEffect dependencies are specified
  return <></>
}

export default Example
