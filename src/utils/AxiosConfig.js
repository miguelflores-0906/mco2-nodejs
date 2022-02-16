import axios from 'axios'

const inDev = process.env.NODE_ENV === 'development'

const app = axios.create({
  baseURL: inDev ? 'http://localhost:5000/' : 'https://imdb-movie-searcher.herokuapp.com/api/',
  withCredentials: true,
})

app.interceptors.response.use(
  response => response.data,
  error => {
    const err = error?.response?.data?.err
    return Promise.reject(err ? err : error.messge)
  }
)

export default app