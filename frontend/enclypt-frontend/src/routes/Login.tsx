import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { postJSON } from "@/utils/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // FastAPI expects { username, password } for OAuth2PasswordRequestForm
      const data = await postJSON("/token", {
        username: email,
        password,
      });
      login(data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Sign in to Enclypt</h1>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
