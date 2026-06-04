import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { request } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { setAuthenticatedUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = await request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setAuthenticatedUser(payload.user);
      setSuccessMessage(payload.message || "Account created successfully.");
      setTimeout(() => navigate("/profile"), 700);
    } catch (error) {
      setErrorMessage(error.message || "Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        setErrorMessage("Google sign-up failed. Please try again.");
        return;
      }

      const payload = await request("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });

      setAuthenticatedUser(payload.user);
      setSuccessMessage(payload.message || "Google sign-up successful.");
      setTimeout(() => navigate("/profile"), 700);
    } catch (error) {
      setErrorMessage(error.message || "Google sign-up failed.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
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
          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}

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
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#a66f3f] py-3 font-medium text-white shadow-md transition hover:bg-[#915f34]"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Signup Button */}
        <div className="mt-4 flex justify-center">
          {hasGoogleClientId ? (
            <GoogleLogin onSuccess={handleGoogleSignup} onError={() => setErrorMessage("Google sign-up failed.")} text="signup_with" />
          ) : (
            <p className="text-center text-sm text-[#8b6f54]">Google sign-up is disabled. Add VITE_GOOGLE_CLIENT_ID to enable it.</p>
          )}
        </div>

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
      <Footer />
    </div>
  );
}

export default Signup;