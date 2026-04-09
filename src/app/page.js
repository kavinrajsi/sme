import Header from "./components/Header";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import OurServices from "./components/OurServices";
import OurProcess from "./components/OurProcess";
import DigitalQuiz from "./components/DigitalQuiz";
import RevenueImpact from "./components/RevenueImpact";
import CaseStudy from "./components/CaseStudy";
import ClientStories from "./components/ClientStories";
import Footer from "./components/Footer";
import DemoModal from "./components/DemoModal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Trust />
        <RevenueImpact />
        <DigitalQuiz />
        <OurServices />
        <CaseStudy />
        <OurProcess />
        <ClientStories />
      </main>
      <Footer />
      <DemoModal />
    </>
  );
}
