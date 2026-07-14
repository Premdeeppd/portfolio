import { Head } from "vite-react-ssg";
import HeroDiv from "../components/HeroDiv";
import LearnWithMeDiv from "../components/LearnWithMeDiv";
import SocialDiv from "../components/SocialDiv";
import SkillsDiv from "../components/SkillDiv";

function Home() {
  const ogImageUrl = "https://www.premdeep.co.in/og/home.png";

  return (
    <div className="Home">
      <Head>
        <title>Prem - Portfolio, articles, and notes</title>
        <meta name="description" content="ROXC | Turing | IIT Roorkee" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prem - Portfolio, articles, and notes" />
        <meta property="og:description" content="ROXC | Turing | IIT Roorkee" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prem - Portfolio, articles, and notes" />
        <meta name="twitter:description" content="ROXC | Turing | IIT Roorkee" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <HeroDiv />
      <LearnWithMeDiv />
      <SocialDiv />
      <SkillsDiv />
    </div>
  );
}

export default Home;

