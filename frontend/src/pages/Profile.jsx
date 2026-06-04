import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#fff7ee] via-[#fffaf2] to-[#f7eadb] px-4 pt-28">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-[#eadfc8] bg-[#fffaf2]/90 p-8 shadow-xl backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-[#7a522f]">Profile Details</h1>
          <p className="mt-2 text-sm text-[#8b6f54]">You are logged in.</p>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-[#e7d2ba] bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#9a6f46]">Name</p>
              <p className="mt-1 text-lg text-[#5f4330]">{user?.name || "-"}</p>
            </div>

            <div className="rounded-xl border border-[#e7d2ba] bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#9a6f46]">Email</p>
              <p className="mt-1 text-lg text-[#5f4330]">{user?.email || "-"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded-xl bg-[#a66f3f] py-3 font-medium text-white shadow-md transition hover:bg-[#915f34]"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
