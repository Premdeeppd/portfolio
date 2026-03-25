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

const primarySkills = [
  {
    name: "React",
    iconMarkup: normalizeSvgMarkup(rawReactLogo),
    iconClassName:
      "[&_svg]:animate-spin-slow group-hover:[&_svg]:animate-spin-faster",
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
];

const secondarySkills = [
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
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0262de] p-3 text-[#ffe3d0] transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110">
        <div
          aria-hidden="true"
          className={`[&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg]:transition-transform ${skill.iconClassName}`}
          dangerouslySetInnerHTML={{ __html: skill.iconMarkup }}
        />
      </div>
    );
  };

  const renderRow = (skills) => (
    <div className="flex flex-wrap justify-center gap-5 md:gap-8">
      {skills.map((skill) => (
        <div
          key={skill.name}
          className="group flex flex-col items-center gap-3"
          aria-label={skill.name}
        >
          {renderLogo(skill)}
          {/* <span className="text-center text-sm font-medium text-[#0262de] sm:text-base">
            {skill.name}
          </span> */}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-3 flex flex-col items-center bg-[#ffe3d0] py-8 sm:mx-4 md:py-10">
      <div className="my-8 flex flex-col items-center gap-8 md:my-12 md:gap-10">
        {renderRow(primarySkills)}
        {renderRow(secondarySkills)}
      </div>
    </div>
  );
}

export default SkillDiv;
