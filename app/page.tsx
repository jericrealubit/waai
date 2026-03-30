import Hero from "./(sections)/hero";
import Services from "./(sections)/services";
import Growth from "./(sections)/growth";
import Portfolio from "./(sections)/portfolio";
import Pricing from "./(sections)/pricing";
import Contact from "./(sections)/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Growth />
      <Portfolio />
      <Pricing />
      <Contact />
    </>
  );
}
