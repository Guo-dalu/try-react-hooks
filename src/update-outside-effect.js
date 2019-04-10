import React, { useState, useCallback, useEffect } from "react"
import Button from "@material-ui/core/Button"
import fetchCat from "./utils/fetchCat"
import Divider from "@material-ui/core/Divider"

function Example() {
  const [productId, setProductId] = useState(0)
  const [url, setUrl] = useState(null)

  //✅ Wrap with useCallback to avoid change on every render
  const fetchProduct = useCallback(
    async () => {
      console.log("---- fetch in callback", productId)
      let ignore = false
      if (ignore === false) {
        // ... Does something with productId ...
        const url = await fetchCat(productId)
        setUrl(url)  
      }
      return () => {
        ignore = true
      }
    },
    [productId]
  ) // ✅ All useCallback dependencies are specified

  // 这样写是错误的，会重复渲染, 如果每次render的值不同，还会死循环
  // const fetchProduct = async () => {
  //      console.log('--- fetch', productId)
  //     const url = await fetchCat(productId)
  //     setUrl(url)
  //   }

  return (
    <>
      {console.log("---render")}
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
      <img alt="kitty" src={url} />
    </>
  )
}

function ProductDetails({ fetchProduct }) {
  useEffect(
    () => {
      console.log("---effect")
      fetchProduct()
    },
    [fetchProduct]
  ) // ✅ All useEffect dependencies are specified
  return <></>
}

export default Example
