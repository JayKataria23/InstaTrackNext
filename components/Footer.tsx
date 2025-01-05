import { BarChart3 } from "lucide-react"; // Ensure you have this icon installed

const navItems = ["features", "team", "contact"]; // Define your nav items

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    // Handle subscription logic here
    console.log("Subscribed with email:", email);
  };

  return (
    <footer
      className="w-full py-16 bg-black/80 backdrop-blur-sm text-white"
      id="contact"
    >
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-extrabold tracking-tighter">InstaTrack</span>
            </div>
            <p className="text-sm">Track Smarter, Engage Better</p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Quick Links</h3>
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-sm hover:text-primary cursor-pointer capitalize"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Contact</h3>
            {["jaykataria2004@gmail.com", "sisha200316@gmail.com"].map(
              (email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="text-sm hover:text-primary"
                >
                  {email}
                </a>
              )
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Stay Updated</h3>
            <p className="text-sm text-gray-300">Subscribe to our newsletter</p>
            <form
              className="mt-2 flex w-full max-w-md"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                name="email" // Add name attribute for easy access
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-sm text-black border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-r-md hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2025 InstaTrack. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
