import React from "react";
import { Link } from "react-router-dom";

function LearnWithMeDiv() {
  return (
    <div className="scroll-mt-28 mx-0 sm:mx-4 flex flex-col items-center bg-brand-blue px-4 py-12 rounded-none sm:px-6 md:px-8 text-center">
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-peach sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Learn With Me
      </h2>
      <p className="max-w-4xl px-1 py-8 text-center text-base leading-relaxed text-white/90 sm:px-2 sm:text-lg md:px-4 md:py-10 md:text-xl lg:text-2xl">
        I learn by <b>building, experimenting, and documenting</b> what I discover along the way. There is a collection of the notes and articles I created while exploring new technologies, concepts, and engineering practices. If that sounds useful to you, explore my <b>Learn With Me</b> collection.
      </p>
      <Link
        to="/read-with-me"
        className="mt-4 inline-block bg-brand-peach text-brand-blue font-bold px-6 py-3 rounded-none shadow-md hover:scale-105 transition-all duration-300"
      >
        Learn With Me →
      </Link>
    </div>
  );
}

export default LearnWithMeDiv;
