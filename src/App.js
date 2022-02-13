import './App.css';
import Header from './components/Header.js'
import Search from './components/Search.js';
import MovieList from './components/MovieList';
import AddMovie from './components/AddMovie'
import DeleteMovie from './components/DeleteMovie'

function App() {
  return (
    <div className="App">
      <Header />
      <Search />
      <MovieList />
      <DeleteMovie />
      <AddMovie />

    </div>
  );
}

export default App;
