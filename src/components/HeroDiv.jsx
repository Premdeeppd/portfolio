import profileImg from "../assets/images/profile.png";

function HeroDiv() {
  return (
    <div id="home" className="scroll-mt-28 mx-0 sm:mx-4 flex flex-col items-center bg-brand-peach px-4 pt-16 sm:pt-20 pb-8 rounded-none sm:px-6 md:px-8">
      <h1 className="text-center text-3xl font-bold leading-tight text-brand-blue sm:text-6xl md:text-7xl lg:text-8xl">
        Hello, I'm Prem Deep
      </h1>
      <h2 className="pb-3 text-center text-base sm:text-2xl font-semibold leading-snug text-brand-blue md:text-3xl lg:text-4xl">
        ROXC | Turing | IIT Roorkee
      </h2>
      <img
        src={profileImg}
        alt="Profile"
        className="w-40 sm:w-50 h-auto my-4 sm:my-6 rotate-[-5deg] border-2 border-brand-blue rounded-none shadow-lg"
      />
      <p className="max-w-4xl px-1 py-4 sm:py-8 text-center text-sm sm:text-lg leading-relaxed text-brand-blue md:px-4 md:py-10 md:text-xl lg:text-2xl">
        Graduated from <b>IIT Roorkee</b>, I’m a <b>software developer</b>{" "}
        focused on building pixel-perfect, scalable, AI-powered web
        applications. With experience spanning both engineering and{" "}
        <b>business management</b>, I bridge the gap between technical execution
        and strategic thinking—turning ideas into impactful products.
      </p>
    </div>
  );
}
export default HeroDiv;
