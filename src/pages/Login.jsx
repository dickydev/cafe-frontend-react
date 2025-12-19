import React from "react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-40 space-y-4">
      <h2 className="text-3xl font-bold text-center">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="w-full p-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full p-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-black text-white py-3 rounded">Login</button>
    </form>
  );
}
