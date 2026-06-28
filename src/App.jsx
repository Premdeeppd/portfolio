import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import ReadWithMe from "./pages/ReadWithMe.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Router>
      <div className="App pt-0 sm:pt-4">
        <NavBar />
        <main className="min-h-[calc(100vh-80px)] pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/read-with-me" element={<ReadWithMe />} />
            <Route path="/notes/:slug" element={<NoteDetail />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
