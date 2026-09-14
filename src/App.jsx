import SiteHeader from "./components/SiteHeader.jsx";
import Hero from "./components/Hero.jsx";
import Showcase from "./components/Showcase.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

export default function App() {
  return (
    <>
      <SiteHeader current="index.html" />
      <main>
        <Hero />
        <Showcase />
      </main>
      <SiteFooter />
    </>
  );
}
