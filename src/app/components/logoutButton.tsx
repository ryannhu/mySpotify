"use client";

import { useRouter } from "next/navigation";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/logout", { method: "POST" });
    console.log(response);
    if (response.ok) {
      router.push("/");
    } else {
      console.log("Failed to logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="border border-white rounded px-6 py-2 mt-4 hover:bg-white hover:text-gray-900">
      Logout
    </button>
  );
};

export default LogoutButton;
