import Hero from "./(sections)/hero";
import Services from "./(sections)/services";
import FeaturedWork from "./(sections)/featured-work";
import Process from "./(sections)/process";
import Growth from "./(sections)/growth";
import Pricing from "./(sections)/pricing";
import Contact from "./(sections)/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedWork />
      <Process />
      <Pricing />
      <Growth />
      <Contact />
    </>
  );
}
