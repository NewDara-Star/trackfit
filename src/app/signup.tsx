import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { supabase } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) alert(error.message);
    else router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4 mt-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
