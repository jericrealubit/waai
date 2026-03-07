export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 md:px-20 py-20 border-t mt-10 bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let&apos;s Build Something
          </h2>
          <p className="text-gray-600 mb-6">
            Ready to upgrade your restaurant or store? Tell us about your
            project and we&apos;ll get back to you with a clear plan.
          </p>

          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Business Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project Type
              </label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>Restaurant Menu Website</option>
                <option>Menu + Ordering System</option>
                <option>Store Website / Catalog</option>
                <option>Something Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-blue text-white px-6 py-2.5 rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-2 text-gray-700">
          <h3 className="text-xl font-semibold">WA AI Digital</h3>
          <p>Perth, Western Australia</p>
          <p>
            <span className="font-medium">Email:</span> hello@waai.au
          </p>
        </div>
      </div>
    </section>
  );
}
