import React, { useState } from "react";
import { useStore } from "../state/store";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function LoginPage() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // ini dipakai untuk nama
  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchCurrentUser(token: string) {
    try {
      const r = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  async function submit() {
    setErr(null);

    if (mode === "register") {
      if (password.length < 6) {
        setErr("Password harus minimal 6 karakter");
        return;
      }
      if (!username.trim()) {
        setErr("Nama harus diisi");
        return;
      }
    }

    const payload: any = { email, password };
    if (mode === "register") payload.name = username; // gunakan username

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        if (j.detail) {
          if (typeof j.detail === "string") setErr(j.detail);
          else if (Array.isArray(j.detail)) setErr(j.detail.map((e: any) => e.msg).join(", "));
          else setErr(JSON.stringify(j.detail));
        } else if (Array.isArray(j)) {
          setErr(j.map((e: any) => e.msg).join(", "));
        } else {
          setErr("Gagal melakukan request");
        }
        return;
      }

      const j = await res.json();

      if (!j.token) {
        setErr("Token tidak diterima dari server");
        return;
      }

      let user = j.user ?? null;
      if (!user) {
        user = await fetchCurrentUser(j.token);
      }

      dispatch({ type: "SET_TOKEN", token: j.token });
      dispatch({ type: "SET_USER", user: user ?? { username: username || "User" } });

      const saved = { token: j.token, user: user ?? { username: username || "User" } };
      localStorage.setItem("app_state", JSON.stringify(saved));
    } catch {
      setErr("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("app_state");
    dispatch({ type: "SET_TOKEN", token: null });
    dispatch({ type: "SET_USER", user: null });
    setErr(null);
    navigate("/login", { replace: true });
  }

  if (state.token && state.user) {
    return (
      <div className="max-w-sm mx-auto space-y-4">
        <div className="bg-white rounded shadow p-4 text-center">
          <h1 className="text-xl font-semibold text-green-700">
            Selamat datang, {state.user.username ?? "User"} 🎉
          </h1>
          <button
            className="mt-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/home")}
          >
            Ke Home
          </button>
          <button
            className="mt-2 text-sm text-gray-700 underline block"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">{mode === "login" ? "Login" : "Register"}</h1>

      <div className="bg-white rounded shadow p-4 space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "register" && (
          <div className="space-y-1">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Nama"
              value={username} // gunakan username
              onChange={(e) => setUsername(e.target.value)} // gunakan setUsername
            />
            <div className="text-xs text-gray-500">Isi nama lengkap kamu</div>
            <div className="text-xs text-red-500">Password harus 6 karater</div>
          </div>
        )}

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={submit}
          disabled={loading || (mode === "register" && password.length < 6)}
        >
          {loading ? "Tunggu..." : mode === "login" ? "Masuk" : "Daftar"}
        </button>
      </div>

      <button
        className="text-sm text-blue-700 underline"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setErr(null);
          setUsername(""); // reset username kalau balik ke login
        }}
      >
        {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Login"}
      </button>
    </div>
  );
}
