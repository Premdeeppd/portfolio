import linkedinImg from "../assets/images/linkedin.png";
import githubImg from "../assets/images/github.png";
import twitterImg from "../assets/images/remove.png";
import emailImg from "../assets/images/email.png";

function SocialDiv() {
  return (
    <div className="flex flex-col items-center bg-[#0262de] mx-4 py-10">
      {/* <h2 className="text-4xl font-semibold text-[#ffe3d0]">Connect Me</h2> */}
      <div className="flex gap-8 my-12">
        <a
          href="https://www.linkedin.com/in/prem-deep/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="w-20 h-20 hover:scale-110 transition-transform"
            style={{
              backgroundColor: "#ffe3d0",
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
            className="w-20 h-20 hover:scale-110 transition-transform"
            style={{
              backgroundColor: "#ffe3d0",
              maskImage: `url(${twitterImg})`,
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
            className="w-20 h-20 hover:scale-110 transition-transform"
            style={{
              backgroundColor: "#ffe3d0",
              maskImage: `url(${githubImg})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </a>
        <a href="mailto:premdeepnawada@gmail.com">
          <div
            className="w-20 h-20 hover:scale-110 transition-transform"
            style={{
              backgroundColor: "#ffe3d0",
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
