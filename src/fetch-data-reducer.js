import React, { Fragment, useState, useEffect, useReducer } from "react"
import axios from "axios"

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    default:
      throw new Error()
  }
}

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  })

  useEffect(
    () => {
            let didCancel = false // 避免组件已经卸载但是组件的状态还是会被设置了
            const fetchData = async () => {
              dispatch({ type: "FETCH_INIT" })
              try {
                const result = await axios(url)
                if (!didCancel) {
                  dispatch({
                    type: "FETCH_SUCCESS",
                    payload: result.data,
                  })
                }
              } catch (error) {
                if (!didCancel) {
                  dispatch({ type: "FETCH_FAILURE" })
                }
              }
            }
            fetchData()
            return () => {
              didCancel = true
            }
          },
    [url] // dispatch可加可不加，因为dispatch在Prop改变的时候不会变
  )
  /* 实际上数据获取并没有被终止（终止数据获取可以用Axios Cancellation来实现），但是已经挂载的组件不再执行状态转换。因为Axios Cancellation在我眼中不是最好的API，这个布尔值也能做阻止组件设置状态的工作。*/

  const doFetch = url => {
    setUrl(url)
  }

  return { ...state, doFetch }
}

function App() {
  const [query, setQuery] = useState("redux")
  const { data, isLoading, isError, doFetch } = useDataApi(
    "http://hn.algolia.com/api/v1/search?query=redux",
    { hits: [] }
  )

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`)

          event.preventDefault()
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  )
}

export default App
