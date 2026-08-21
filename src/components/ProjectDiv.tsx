import Image from "next/image";
import { Project, projects } from "../data/projects";

export default function ProjectDiv() {
  return (
    <div
      id="projects"
      className="scroll-mt-28 mx-0 sm:mx-4 flex flex-col items-center bg-brand-peach px-4 py-12 rounded-none sm:px-6 md:px-8 text-center"
    >
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-blue sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Projects
      </h2>

      <p className="max-w-4xl px-1 py-8 text-center text-base leading-relaxed text-brand-blue sm:px-2 sm:text-lg md:px-4 md:py-10 md:text-xl lg:text-2xl">
        I believe putting projects in a portfolio that are not{" "}
        <b>used by real users</b> and are not of <b>production quality</b>{" "}
        doesn&apos;t make much sense anymore, thanks to AI. So I decided to put
        only projects that are actually used by real users.
        <br /><br />
        Currently, I have only one — <b>Examlo</b>.
      </p>

      <div className="flex w-full max-w-4xl flex-wrap justify-center gap-8">
        {projects.map((project: Project) => (
          <div
            key={project.id}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 border-2 border-brand-blue rounded-none shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden bg-brand-peach">
              <Image
                src={project.logo}
                alt={`${project.title} Logo`}
                width={160}
                height={160}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title} live website`}
              className="inline-flex items-center gap-2 bg-brand-blue text-brand-peach font-bold px-8 py-3.5 rounded-none shadow-md hover:scale-105 transition-all duration-300 text-base sm:text-lg no-underline"
            >
              <span>Visit {project.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}


