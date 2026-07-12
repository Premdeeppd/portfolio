import HeroDiv from "../components/HeroDiv";
import LearnWithMeDiv from "../components/LearnWithMeDiv";
import SocialDiv from "../components/SocialDiv";
import SkillsDiv from "../components/SkillDiv";

function Home() {
  return (
    <div className="Home">
      <HeroDiv />
      <LearnWithMeDiv />
      <SocialDiv />
      <SkillsDiv />
    </div>
  );
}

export default Home;
