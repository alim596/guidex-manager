import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-8">
        {/* Left Section */}
        <div className="space-y-4">
          <img
            className="w-32"
            src="/assets/bilkent_logo_with_label.jpg"
            alt="Bilkent Logo With Label"
          />
          <p className="text-gray-400 text-sm leading-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-lg font-semibold mb-4">Quick Links</p>
          <ul className="grid grid-cols-2 gap-4 text-sm">
            <li>
              <button
                onClick={() => navigate("visitor/home")}
                className="hover:text-blue-400 transition-all"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/visitor/about")}
                className="hover:text-blue-400 transition-all"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("visitor/contact")}
                className="hover:text-blue-400 transition-all"
              >
                Contact Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-blue-400 transition-all"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-lg font-semibold mb-4">Get In Touch</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="tel:+90 506 909 38 05"
                className="hover:text-blue-400 transition-all"
              >
                +90 506 909 38 05
              </a>
            </li>
            <li>
              <a
                href="mailto:guidexdev@gmail.com"
                className="hover:text-blue-400 transition-all"
              >
                guidexdev@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-gray-900 py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2024 Guidex. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
