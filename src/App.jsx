import "./styles/App.css";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <div className="App pt-4">
      <NavBar />
      <Home />
    </div>
  );
}

export default App;
