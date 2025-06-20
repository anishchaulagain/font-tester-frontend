
import Header from '../_components/LandingPage/Header';
import Hero from '../_components/LandingPage/Hero';
import FontPreviewDemo from '../_components/LandingPage/FontPreviewExample';
import FeatureSection from '../_components/LandingPage/FeatureSection';
import CTA from '../_components/LandingPage/CTA';
import Footer from '../_components/LandingPage/Footer';
import { ThemeProvider } from '../context/ThemeContext';

const FontTesterLanding = () => {
    return (
         <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 transition-colors">
            <Header />
            <Hero />
            <FontPreviewDemo />
            <FeatureSection />
            <CTA />
            <Footer />
        </div>
        </ThemeProvider>
    );
};

export default FontTesterLanding;