import { useAudience } from "@/providers/audience-provider";
import Hero from "./hero";
import FeaturedCourses from "./featured-courses";
import LatestAnnouncements from "./latest-announcements";
import RulesSection from "./rules-section";

const HomePage = () => {
  const { audience } = useAudience();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:py-10 space-y-8">
      <Hero audience={audience} />
      <FeaturedCourses />
      <LatestAnnouncements />
      <RulesSection />
    </main>
  );
};

export default HomePage;