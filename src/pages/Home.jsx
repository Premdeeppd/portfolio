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
        <meta name="author" content="Prem Deep" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.premdeep.co.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.premdeep.co.in/" />
        <meta property="og:title" content="Prem - Portfolio, articles, and notes" />
        <meta property="og:description" content="ROXC | Turing | IIT Roorkee" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prem - Portfolio, articles, and notes" />
        <meta name="twitter:description" content="ROXC | Turing | IIT Roorkee" />
        <meta name="twitter:image" content={ogImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://www.premdeep.co.in/#person",
                "name": "Prem Deep",
                "jobTitle": "Software Developer",
                "alumniOf": {
                  "@type": "CollegeOrUniversity",
                  "name": "IIT Roorkee"
                },
                "url": "https://www.premdeep.co.in"
              },
              {
                "@type": "WebSite",
                "@id": "https://www.premdeep.co.in/#website",
                "url": "https://www.premdeep.co.in",
                "name": "Prem - Portfolio, articles, and notes",
                "description": "ROXC | Turing | IIT Roorkee",
                "author": {
                  "@id": "https://www.premdeep.co.in/#person"
                }
              }
            ]
          })}
        </script>
      </Head>
      <HeroDiv />
      <LearnWithMeDiv />
      <SocialDiv />
      <SkillsDiv />
    </div>
  );
}

export default Home;

