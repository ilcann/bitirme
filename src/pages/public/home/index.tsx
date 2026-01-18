import { useAudience } from "@/providers/audience-provider";
import Hero from "./hero";
import FeaturedCourses from "./featured-courses";
import LatestAnnouncements from "./latest-announcements";

const HomePage = () => {
  const { audience } = useAudience();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10 space-y-16">
      <Hero audience={audience} />
      <FeaturedCourses />
      <LatestAnnouncements />
    </main>
  );
};

export default HomePage;