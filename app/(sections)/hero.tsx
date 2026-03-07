export default function Hero() {
  return (
    <section className="px-6 md:px-20 py-24 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold mb-6">
          Websites & Ordering Systems Built for WA Businesses
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          We build fast, modern menu and ordering systems for restaurants and
          stores.
        </p>

        <div className="flex gap-4">
          <button className="bg-brand-blue text-white px-6 py-3 rounded-lg">
            Start Project
          </button>
          <button className="border border-brand-blue text-brand-blue px-6 py-3 rounded-lg">
            View Demo
          </button>
        </div>
      </div>

      <img
        src="/images/hero-mockup.png"
        alt="Ordering UI"
        className="w-full max-w-md mt-12 md:mt-0"
      />
    </section>
  );
}
