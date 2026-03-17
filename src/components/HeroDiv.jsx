import profileImg from "../assets/images/profile.png";

function HeroDiv() {
  return (
    <div className="flex flex-col items-center bg-[#ffe3d0] mx-4">
      <h1 className="text-8xl text-center font-bold pt-8 text-[#0262de]">
        Hello, I'm Prem Deep
      </h1>
      <h2 className="text-4xl text-center font-semibold py-4 text-[#0262de]">
        Business Manager | Software Developer
      </h2>
      <img
        src={profileImg}
        alt="Profile"
        className="w-2xs h-2xs my-6 rotate-[-5deg] border-2 border-[#0262de] rounded-lg shadow-lg"
      />
      <p className="text-2xl text-center max-w-4xl px-4 py-12 text-[#0262de]">
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
