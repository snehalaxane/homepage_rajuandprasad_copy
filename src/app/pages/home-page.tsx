import { ModernHeroSection } from '../components/modern-hero-section';
import { ModernStatsSection } from '../components/modern-stats-section';
import { ModernServicesSection } from '../components/modern-services-section';
import { ModernTeamSection } from '../components/modern-team-section';
import { ScrollToTop } from '../components/scroll-to-top';

export function HomePage() {
  return (
    <>
      <ModernHeroSection />
      <ModernStatsSection />
      <ModernServicesSection />
      <ModernTeamSection />
      <ScrollToTop />
    </>
  );
}