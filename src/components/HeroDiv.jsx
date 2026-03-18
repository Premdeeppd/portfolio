import profileImg from "../assets/images/profile.png";

function HeroDiv() {
  return (
    <div className="mx-4 flex flex-col items-center bg-[#ffe3d0] px-4 sm:mx-4 sm:px-6 md:px-8">
      <h1 className="pt-8 text-center text-4xl font-bold leading-tight text-[#0262de] sm:text-6xl md:text-7xl lg:text-8xl">
        Hello, I'm Prem Deep
      </h1>
      <h2 className="py-3 text-center text-xl font-semibold leading-snug text-[#0262de] sm:py-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Business Manager | Software Developer
      </h2>
      <img
        src={profileImg}
        alt="Profile"
        className="w-50 h-auto my-6 rotate-[-5deg] border-2 border-[#0262de] rounded-lg shadow-lg sm:w-2xs"
      />
      <p className="max-w-4xl px-1 py-8 text-center text-base leading-relaxed text-[#0262de] sm:px-2 sm:text-lg md:px-4 md:py-10 md:text-xl lg:text-2xl">
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
