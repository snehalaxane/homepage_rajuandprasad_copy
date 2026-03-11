import { ModernHeroSection } from '../components/modern-hero-section';
import { ModernNavbar } from '../components/modern-navbar';
import { ModernStatsSection } from '../components/modern-stats-section';
import { ModernServicesSection } from '../components/modern-services-section';
import { ModernTeamSection } from '../components/modern-team-section';
import InfrastructureSection from '../components/infrastructure-section';
import { ScrollToTop } from '../components/scroll-to-top';
import { NewsTicker } from '../components/news-ticker';

interface HomePageProps {
  activePage: string;
}

export function HomePage({ activePage }: HomePageProps) {
  return (
    <>
      <ModernHeroSection />
      <div className="relative z-50">
        <ModernNavbar activePage={activePage} />
      </div>
      <NewsTicker />
      <ModernStatsSection />
      <ModernServicesSection />
      <InfrastructureSection />
      {/* <ModernTeamSection /> */}
      <ScrollToTop />
    </>
  );
}
