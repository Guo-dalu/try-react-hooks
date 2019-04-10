import request from "axios"

async function fetchCat() {
  const {data:[{url}]} = await request("https://api.thecatapi.com/v1/images/search")
  return url
}

export default fetchCat
