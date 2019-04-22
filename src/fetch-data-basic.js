import React, { Fragment, useState, useEffect } from "react"
import axios from "axios"
import Input from "@material-ui/core/Input"
import Button from "@material-ui/core/Button"

function App() {
  const [data, setData] = useState({ hits: [] })
  const [query, setQuery] = useState("redux")
  const [url, setUrl] = useState(
    "http://hn.algolia.com/api/v1/search?query=redux"
  )

  /* eslint-disable */
  useEffect(
    async () => {
      // const fetchData = async () => {
      //   const result = await axios(url)

      //   setData(result.data)
      // }
      // fetchData()
      const result = await axios(url)

      setData(result.data)
    },
    [url]
  )

  return (
    <Fragment>
      <Input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <Button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </Button>
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default App
