import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mx-4 flex flex-col items-center justify-center text-center bg-brand-peach py-20 px-4 rounded-b-2xl shadow-md sm:mx-4">
      <h1 className="text-7xl font-bold text-brand-blue mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-brand-blue/90 mb-6">
        Oops! Page Not Found
      </h2>
      <p className="max-w-md text-slate-700 mb-8">
        The content or page you are looking for doesn't exist. It might have been moved, deleted, or is temporarily unavailable.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/read-with-me"
          className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-brand-peach hover:bg-blue-700 transition-colors shadow-sm"
        >
          Go to Read with Me
        </Link>
        <Link
          to="/"
          className="rounded-full border-2 border-brand-blue px-6 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/5 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
