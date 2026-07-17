import Image from "next/image";
import githubIcon from "../assets/images/github.png";
import { Project, projects } from "../data/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-none border border-white/40 bg-brand-peach p-5 shadow-[0_20px_60px_rgba(2,98,222,0.12)] transition-transform duration-300 md:hover:-translate-y-1 ${project.layoutClassName}`}
    >
      {/* Front Content */}
      <div className="flex h-full flex-col justify-between transition-all duration-300 group-hover:blur-xs group-hover:opacity-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-brand-blue sm:text-2xl">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-brand-blue/85 line-clamp-4">
            {project.description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-none bg-brand-blue px-2.5 py-0.5 text-xs font-semibold text-brand-peach"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-brand-peach/40 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center justify-center gap-6 px-6 py-6">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View GitHub repository for ${project.title}`}
            className="group/btn flex flex-col items-center gap-1.5 text-brand-blue no-underline"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-none bg-brand-blue p-2.5 transition-transform duration-300 hover:scale-110">
              <Image
                src={githubIcon}
                alt="GitHub"
                className="h-full w-full object-contain brightness-0 invert"
                width={24}
                height={24}
              />
            </span>
            <span className="text-xs font-semibold">GitHub</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit live website for ${project.title}`}
              className="group/btn flex flex-col items-center gap-1.5 text-brand-blue no-underline"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-none bg-brand-blue p-2.5 transition-transform duration-300 hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-brand-peach"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </span>
              <span className="text-xs font-semibold">Live Site</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectDiv() {
  return (
    <section id="projects" className="mx-0 mt-3 sm:mx-4 rounded-none bg-brand-blue px-4 py-8 sm:px-5 md:px-6 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-center">
          <h2 className="text-2xl font-semibold leading-snug text-brand-peach sm:text-3xl md:text-4xl">
            Projects
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[11rem]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
