"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Profile image

  // 🔥 Fix: Redirect only after rendering
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🔹 Validate password confirmation
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      const userId = result.data.user?.id;

      // 🔹 Upload profile image if provided
      let avatarUrl = null;
      if (avatarFile && userId) {
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`public/${userId}`, avatarFile);

        if (uploadError) {
          setError(uploadError.message);
          setLoading(false);
          return;
        }

        // 🔥 Fix: Use `data.path` to construct the avatar URL
        if (data) {
          avatarUrl = `${
            supabase.storage.from("avatars").getPublicUrl(data.path).data
              .publicUrl
          }`;
        }
        avatarUrl = `${
          supabase.storage.from("avatars").getPublicUrl(`public/${userId}`).data
            .publicUrl
        }`;
      }

      // 🔹 Save user profile (nickname & avatar) to Supabase database
      await supabase.from("profiles").insert([
        {
          id: userId,
          email,
          nickname,
          avatar_url: avatarUrl,
        },
      ]);
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-sm shadow-lg border border-gray-300 bg-white rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-2xl text-center font-semibold text-gray-900 mb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </CardTitle>
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {isSignUp && (
              <>
                <Input
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="border p-2 rounded-md"
                />
              </>
            )}
            {!isSignUp && (
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-blue-500 font-medium hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
