import { createElement, useCallback, useEffect, useState } from "react";
import { Check, Edit3, MapPin, Package, Phone, ShoppingBag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const PROFILE_STORAGE_KEY = "actshiine_profile_v1";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveProfile(data) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load saved profile on mount
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const savedProfile = loadProfile();
      if (savedProfile) {
        setForm((prev) => ({ ...prev, ...savedProfile }));
      } else if (user?.name) {
        setForm((prev) => ({ ...prev, fullName: user.name }));
      }
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [user]);

  const handleChange = useCallback((field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSave = () => {
    saveProfile(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fields = [
    { key: "fullName", label: "Full Name", icon: User, placeholder: "John Doe", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, placeholder: "9876543210", required: true, maxLength: 10, type: "tel" },
    { key: "line1", label: "Address Line 1", icon: MapPin, placeholder: "House / Flat / Street", required: true },
    { key: "line2", label: "Address Line 2 (optional)", icon: MapPin, placeholder: "Landmark / Area", required: false },
    { key: "city", label: "City", icon: MapPin, placeholder: "Mumbai", required: true },
    { key: "state", label: "State", icon: MapPin, placeholder: "Maharashtra", required: true },
    { key: "pincode", label: "Pincode", icon: MapPin, placeholder: "400001", required: true, maxLength: 6 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#fff7ee] via-[#fffaf2] to-[#f7eadb] px-4 pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-2xl space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="rounded-3xl border border-[#eadfc8] bg-[#fffaf2]/90 p-5 shadow-xl backdrop-blur-xl sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 sm:items-center">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8a6038]/10 sm:h-16 sm:w-16">
                  <User size={20} className="text-[#8a6038] sm:size-[28px]" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-[#7a522f] sm:text-2xl">{user?.name || "User"}</h1>
                  <p className="text-xs text-[#8b6f54] sm:text-sm">{user?.email || "Account verified"}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                  editing
                    ? "bg-[#dcc8aa] text-[#7a522f] hover:bg-[#d3b48f]"
                    : "bg-[#8a6038] text-white hover:bg-[#7a522f]"
                }`}
              >
                {editing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Edit3 size={12} className="sm:size-[14px]" /> Edit
                  </>
                )}
              </button>
            </div>

            {/* Success banner */}
            {saved && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2.5 text-xs font-medium text-green-700 sm:mt-4 sm:px-4 sm:py-3 sm:text-sm">
                <Check size={14} className="shrink-0 sm:size-[16px]" />
                Profile saved successfully! Your details will auto-fill when ordering.
              </div>
            )}

            {/* Editable Fields */}
            <div className="mt-4 space-y-3 sm:mt-8 sm:space-y-4">
              {fields.map(({ key, label, icon, placeholder, required, maxLength, type }) => (
                <div key={key} className="rounded-xl border border-[#e7d2ba] bg-white/90 p-3 sm:p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#9a6f46] sm:text-xs">
                    {label} {required && <span className="text-red-400">*</span>}
                  </p>
                  {editing ? (
                    <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
                      {createElement(icon, { size: 14, className: "shrink-0 text-[#b8a692] sm:size-[16px]" })}
                      <input
                        type={type || "text"}
                        value={form[key]}
                        onChange={handleChange(key)}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        className="w-full bg-transparent text-base text-[#5f4330] outline-none placeholder:text-[#cabbac] sm:text-lg"
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-base text-[#5f4330] sm:text-lg">
                      {form[key] || <span className="italic text-[#cabbac]">Not set</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Save / Logout buttons */}
            <div className="mt-5 space-y-2.5 sm:mt-8 sm:space-y-3">
              {editing && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8a6038] py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#7a522f] active:scale-[0.98] sm:py-3 sm:text-base"
                >
                  <Check size={16} className="sm:size-[18px]" />
                  Save Profile
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl bg-[#a66f3f] py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#915f34] sm:py-3 sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="group flex items-center gap-3 rounded-2xl border border-[#eadfc8] bg-[#fffaf2]/80 p-4 text-left shadow-sm backdrop-blur-sm transition hover:shadow-md sm:gap-4 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8a6038]/10 transition group-hover:bg-[#8a6038]/20 sm:h-12 sm:w-12">
                <Package size={18} className="text-[#8a6038] sm:size-[22px]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#7a522f] sm:text-base">My Orders</p>
                <p className="text-[10px] text-[#8b6f54] sm:text-xs">View order history</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="group flex items-center gap-3 rounded-2xl border border-[#eadfc8] bg-[#fffaf2]/80 p-4 text-left shadow-sm backdrop-blur-sm transition hover:shadow-md sm:gap-4 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8a6038]/10 transition group-hover:bg-[#8a6038]/20 sm:h-12 sm:w-12">
                <ShoppingBag size={18} className="text-[#8a6038] sm:size-[22px]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#7a522f] sm:text-base">Wishlist</p>
                <p className="text-[10px] text-[#8b6f54] sm:text-xs">Your saved items</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
