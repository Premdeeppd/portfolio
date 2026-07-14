import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { Analytics } from "@vercel/analytics/react";
import "../styles/App.css";

export default function Layout() {
  return (
    <div className="App pt-0 sm:pt-4">
      <NavBar />
      <main className="min-h-[calc(100vh-80px)] pb-12">
        <Outlet />
      </main>
      <Analytics />
    </div>
  );
}
