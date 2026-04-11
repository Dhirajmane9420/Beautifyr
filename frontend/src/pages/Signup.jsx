import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#fff7ee] via-[#fffaf2] to-[#f7eadb] px-4 pt-28">
      {/* CARD */}
      <div className="w-full max-w-md rounded-3xl border border-[#eadfc8] bg-[#fffaf2]/90 p-8 shadow-xl backdrop-blur-xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold text-[#7a522f]">
            Create an Account
          </h2>
          <p className="text-sm text-[#8b6f54]">
            Join us and start your skincare journey
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-[#b69576]" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#e7d2ba] bg-white/90 py-3 pr-4 pl-10 text-[#5f4330] transition focus:border-[#a66f3f] focus:ring-2 focus:ring-[#a66f3f]/25 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-[#b69576]" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#e7d2ba] bg-white/90 py-3 pr-4 pl-10 text-[#5f4330] transition focus:border-[#a66f3f] focus:ring-2 focus:ring-[#a66f3f]/25 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-[#b69576]" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#e7d2ba] bg-white/90 py-3 pr-11 pl-10 text-[#5f4330] transition focus:border-[#a66f3f] focus:ring-2 focus:ring-[#a66f3f]/25 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9a6f46] transition hover:text-[#7a522f]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#a66f3f] py-3 font-medium text-white shadow-md transition hover:bg-[#915f34]"
          >
            Sign Up
          </button>
        </form>

        {/* Signup Button */}
        <button
          className="mt-4 w-full rounded-xl border border-[#e0c3a3] bg-white py-3 text-[#7a522f] transition hover:bg-[#f8ede0]"
        >
          Sign up with Google
        </button>

        {/* Login Redirect */}
        <p className="mt-6 text-center text-sm text-[#8b6f54]">
          Already have an account? {" "}
          <span
            className="cursor-pointer font-medium text-[#9a6f46] transition hover:text-[#7a522f] hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
    </>
  );
}

export default Signup;