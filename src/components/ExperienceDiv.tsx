import React from "react";

export default function ExperienceDiv() {
  return (
    <div
      id="experience"
      className="scroll-mt-28 mx-0 sm:mx-4 flex flex-col items-center bg-brand-blue px-4 py-12 rounded-none sm:px-6 md:px-8 text-center"
    >
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-peach sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Experience
      </h2>
      <p className="max-w-4xl px-1 py-8 text-center text-base leading-relaxed text-white/90 sm:px-2 sm:text-lg md:px-4 md:py-10 md:text-xl lg:text-2xl">
        Currently working as a <b>Founding Engineer @ROXC</b>, contributing to
        building and maintaining the company&apos;s internal software
        infrastructure and developing practical AI solutions for the client that
        solve real business problems.
        <br /><br />
        I also worked as <b>RA @Turing</b>,
        contributing to large language model and AI development and I also
        delivered <b>15+ freelance projects</b>, building reliable and scalable
        solutions for clients across different domains.
      </p>
    </div>
  );
}
