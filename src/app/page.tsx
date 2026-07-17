import HeroDiv from "@/components/HeroDiv";
import LearnWithMeDiv from "@/components/LearnWithMeDiv";
import SocialDiv from "@/components/SocialDiv";
import SkillDiv from "@/components/SkillDiv";

export default function Home() {
  const jsonLd = {
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
      },
      {
        "@type": "ItemList",
        "@id": "https://www.premdeep.co.in/#sitenavigation",
        "name": "Primary Navigation",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Home",
            "url": "https://www.premdeep.co.in/"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Learn with Me",
            "url": "https://www.premdeep.co.in/read-with-me"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Technical Notes",
            "url": "https://www.premdeep.co.in/read-with-me#notes"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Articles",
            "url": "https://www.premdeep.co.in/read-with-me#articles"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Contact",
            "url": "https://www.premdeep.co.in/#contact"
          }
        ]
      }
    ]
  };

  return (
    <div className="Home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroDiv />
      <LearnWithMeDiv />
      <SocialDiv />
      <SkillDiv />
    </div>
  );
}
