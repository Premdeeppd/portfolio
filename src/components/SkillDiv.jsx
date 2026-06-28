import React from "react";
import rawReactLogo from "../assets/images/react.svg?raw";
import rawJavaScriptLogo from "../assets/images/javascript.svg?raw";
import rawNodeJsLogo from "../assets/images/nodejs.svg?raw";
import rawExpressLogo from "../assets/images/express.svg?raw";
import rawMongoDbLogo from "../assets/images/mongodb.svg?raw";
import rawTailwindLogo from "../assets/images/tailwind.svg?raw";
import rawAwsLogo from "../assets/images/aws.svg?raw";
import rawDockerLogo from "../assets/images/docker.svg?raw";
import rawRedisLogo from "../assets/images/redis.svg?raw";
import rawPostgreSqlLogo from "../assets/images/postgresql.svg?raw";
import rawReduxLogo from "../assets/images/redux.svg?raw";
import rawTypeScriptLogo from "../assets/images/typescript.svg?raw";

const normalizeSvgMarkup = (svgMarkup) =>
  svgMarkup
    .replace(/<\?xml[\s\S]*?\?>\s*/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>\s*/gi, "")
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .replace(/<title[\s\S]*?<\/title>\s*/gi, "")
    .replace(/fill="(?!none|currentColor)[^"]*"/gi, 'fill="currentColor"')
    .trim();

const skills = [
  {
    name: "React",
    iconMarkup: normalizeSvgMarkup(rawReactLogo),
    iconClassName: "",
  },
  {
    name: "JavaScript",
    iconMarkup: normalizeSvgMarkup(rawJavaScriptLogo),
    iconClassName: "",
  },
  {
    name: "Node.js",
    iconMarkup: normalizeSvgMarkup(rawNodeJsLogo),
    iconClassName: "",
  },
  {
    name: "Express",
    iconMarkup: normalizeSvgMarkup(rawExpressLogo),
    iconClassName: "",
  },
  {
    name: "MongoDB",
    iconMarkup: normalizeSvgMarkup(rawMongoDbLogo),
    iconClassName: "",
  },
  {
    name: "Tailwind CSS",
    iconMarkup: normalizeSvgMarkup(rawTailwindLogo),
    iconClassName: "",
  },
  {
    name: "AWS",
    iconMarkup: normalizeSvgMarkup(rawAwsLogo),
    iconClassName: "",
  },
  {
    name: "Docker",
    iconMarkup: normalizeSvgMarkup(rawDockerLogo),
    iconClassName: "",
  },
  {
    name: "Redis",
    iconMarkup: normalizeSvgMarkup(rawRedisLogo),
    iconClassName: "",
  },
  {
    name: "PostgreSQL",
    iconMarkup: normalizeSvgMarkup(rawPostgreSqlLogo),
    iconClassName: "",
  },
  {
    name: "Redux",
    iconMarkup: normalizeSvgMarkup(rawReduxLogo),
    iconClassName: "",
  },
  {
    name: "TypeScript",
    iconMarkup: normalizeSvgMarkup(rawTypeScriptLogo),
    iconClassName: "",
  },
];

function SkillDiv() {
  const renderLogo = (skill) => {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-none bg-brand-blue p-3 text-brand-peach transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110">
        <div
          aria-hidden="true"
          className={`[&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg]:transition-transform ${skill.iconClassName}`}
          dangerouslySetInnerHTML={{ __html: skill.iconMarkup }}
        />
      </div>
    );
  };

  return (
    <div className="mx-0 sm:mx-4 flex flex-col items-center bg-brand-peach py-8 md:py-10 rounded-none">
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-blue sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Tools I used
      </h2>
      <div className="my-8 grid grid-cols-4 gap-x-3 gap-y-5 md:my-12 md:grid-cols-6 md:gap-8">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="group flex justify-center"
            aria-label={skill.name}
          >
            {renderLogo(skill)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillDiv;
