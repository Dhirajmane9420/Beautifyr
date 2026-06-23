import { Link } from "react-router-dom";
import brandLogo from "../assets/logo-removebg-preview.png";

function Footer() {
  return (
    <footer className="mt-12 rounded-t-4xl bg-[#1A1816] px-5 pb-12 pt-10 text-[#FCFAF8] sm:rounded-t-[3rem] sm:px-6 sm:pt-12 md:px-12 lg:px-24 lg:pt-14">
      <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Link to="/" className="inline-block mb-6">
            <img src={brandLogo} alt="ActShiiNe" className="h-14 w-auto object-contain brightness-0 invert opacity-90" />
          </Link>
          <p className="max-w-md text-sm font-light leading-relaxed text-white/55 sm:text-base">
            Elevating your natural radiance with clinical grade formulations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm font-light text-white/65 sm:grid-cols-2 lg:col-span-7">
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-white">Quick Links</h4>
            <Link to="/" className="transition-colors hover:text-white">Home</Link>
            <Link to="/categories" className="transition-colors hover:text-white">Shop Products</Link>
            <Link to="/orders" className="transition-colors hover:text-white">My Orders</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-white">Support</h4>
            <Link to="/contact" className="transition-colors hover:text-white">Contact Us</Link>
            <a href="#" className="transition-colors hover:text-white">Shipping Policy</a>
            <a href="#" className="transition-colors hover:text-white">Cancelling and Refund Policy</a>
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
            <a href="#" className="transition-colors hover:text-white">Terms</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-xs font-light text-white/40 md:flex-row md:items-center md:justify-between">
        <p>© 2026 ActShiiNe. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <a href="#" className="transition-colors hover:text-white">Instagram</a>
          <a href="#" className="transition-colors hover:text-white">Twitter</a>
          <a href="#" className="transition-colors hover:text-white">Facebook</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;