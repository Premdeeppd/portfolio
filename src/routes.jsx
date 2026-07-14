import React from "react";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ReadWithMe from "./pages/ReadWithMe.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "read-with-me", element: <ReadWithMe /> },
      { path: "notes/:slug", element: <NoteDetail /> },
      { path: "articles/:slug", element: <ArticleDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
