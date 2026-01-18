import { useAudience } from "@/providers/audience-provider";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import Hero from "./hero";
import FeaturedCourses from "./featured-courses";
import LatestAnnouncements from "./latest-announcements";

const HomePage = () => {
  const { audience } = useAudience();
  const { t } = useTranslation();
  
  useDocumentTitle(
    t('home.title'),
    t('home.description')
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Hero audience={audience} />
      </motion.div>

      <motion.div {...fadeInUp} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <FeaturedCourses />
      </motion.div>

      <motion.div {...fadeInUp} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}>
        <LatestAnnouncements />
      </motion.div>
    </main>
  );
};

export default HomePage;