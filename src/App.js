import './App.css';
import Header from './components/Header.js';
import MovieList from './components/MovieList';
import AddMovie from './components/AddMovie';
// import DeleteMovie from './components/DeleteMovie';
// import {useEffect} from 'react'
// import Axios from 'axios'

function App() {
    // useEffect(() => {
    //   Axios.get("http://localhost:5000/getAll").then((response) => {
    //     console.log(response.data)
    //   })
    // }, [])

    return (
        <div className="App">
            <Header />
            <AddMovie />
            <MovieList />
        </div>
    );
}

export default App;
