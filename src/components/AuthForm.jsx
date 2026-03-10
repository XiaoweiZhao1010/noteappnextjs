import { useState } from "react";
import api from "@/lib/api";

export default function AuthForm({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const setError = (name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login";
      const data = await api.post(endpoint, { email, password });
      const token = data.token;

      sessionStorage.setItem("jwtToken", token);
      const user = { email };
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user);
    } catch (error) {
      const message =
        error?.responseData?.message ||
        error?.responseData?.error ||
        "An error occurred. Please try again.";
      setError("email", message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(241,236,236)] px-4">
      <form
        onSubmit={handleAuth}
        className="w-full max-w-sm rounded-xl bg-[rgb(241,236,236)] p-8 shadow"
      >
        <h2 className="mb-5 text-center text-2xl font-semibold text-slate-800">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        <input
          autoFocus
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
        {errors.email && (
          <p className="mb-2 text-sm text-red-600">{errors.email}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
        {errors.password && (
          <p className="mb-2 text-sm text-red-600">{errors.password}</p>
        )}

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp((v) => !v)}
          className="mt-4 w-full text-center text-sm text-blue-700 hover:underline"
        >
          {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
        </button>
      </form>
    </div>
  );
}

