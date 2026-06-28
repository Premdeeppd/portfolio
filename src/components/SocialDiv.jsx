import linkedinImg from "../assets/images/linkedin.png";
import githubImg from "../assets/images/github.png";
import xImg from "../assets/images/x_logo.png";
import emailImg from "../assets/images/email.png";

function SocialDiv() {
  return (
    <div id="contact" className="scroll-mt-28 flex flex-col items-center bg-brand-blue mx-3 py-8 sm:mx-4 md:py-10">
      <h2 className="pb-3 text-center text-xl font-semibold leading-snug text-brand-peach sm:pb-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Connect Me
      </h2>
      <div className="my-8 flex flex-wrap justify-center gap-5 md:my-12 md:gap-8">
        <a
          href="https://www.linkedin.com/in/prem-deep/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="h-14 w-14 bg-brand-peach transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              maskImage: `url(${linkedinImg})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </a>
        <a
          href="https://x.com/Prem_deep_pd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="h-14 w-14 bg-brand-peach transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              maskImage: `url(${xImg})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </a>
        <a
          href="https://github.com/Premdeeppd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="h-14 w-14 bg-brand-peach transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              maskImage: `url(${githubImg})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </a>
        <a href="mailto:premdeepnawada@gmail.com">
          <div
            className="h-14 w-14 bg-brand-peach transition-transform sm:h-16 sm:w-16 md:h-20 md:w-20 md:hover:scale-110"
            style={{
              maskImage: `url(${emailImg})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default SocialDiv;
