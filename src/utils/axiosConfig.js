import Axios from 'axios'

const inDev = process.env.NODE_ENV === 'development'

const app = Axios.create({
    baseURL: inDev ? 'http://localhost:5000/api/' : 'https://imdb-movie-searcher.herokuapp.com/api/',
    withCredentials: true,
  })

  console.log(app)

app.interceptors.response.use(
response => response.data,
error => {
    const err = error?.response?.data?.err
    return Promise.reject(err ? err : error.messge)
}
)

export default app