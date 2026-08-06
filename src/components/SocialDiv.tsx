import linkedinImg from "../assets/images/linkedin.png";
import githubImg from "../assets/images/github.png";
import xImg from "../assets/images/x_logo.png";
import emailImg from "../assets/images/email.png";

export default function SocialDiv() {
  return (
    <div id="contact" className="scroll-mt-28 flex flex-col items-center bg-brand-peach mx-0 sm:mx-4 py-8 md:py-10 rounded-none">
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-blue sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Connect Me
      </h2>
      <div className="my-8 flex flex-wrap justify-center gap-5 md:my-12 md:gap-8">
        <a
          href="https://www.linkedin.com/in/prem-deep/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <div
            className="h-14 w-14 rounded-full bg-brand-blue transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              WebkitMaskImage: `url(${linkedinImg.src})`,
              maskImage: `url(${linkedinImg.src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </a>
        <a
          href="https://x.com/Prem_deep_pd"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter / X"
        >
          <div
            className="h-14 w-14 rounded-full bg-brand-blue transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              WebkitMaskImage: `url(${xImg.src})`,
              maskImage: `url(${xImg.src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </a>
        <a
          href="https://github.com/Premdeeppd"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <div
            className="h-14 w-14 rounded-full bg-brand-blue transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              WebkitMaskImage: `url(${githubImg.src})`,
              maskImage: `url(${githubImg.src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </a>
        <a href="mailto:premdeepnawada@gmail.com" aria-label="Email">
          <div
            className="h-14 w-14 rounded-full bg-brand-blue transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              WebkitMaskImage: `url(${emailImg.src})`,
              maskImage: `url(${emailImg.src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </a>
      </div>
    </div>
  );
}
