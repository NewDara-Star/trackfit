"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function Auth() {
  const { supabase } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error("No user data returned");

        // 🔥 Debugging: Log the user ID before inserting the profile
        console.log("User ID after sign-up:", authData.user.id);

        let avatarUrl = null;
        if (avatarFile) {
          const fileExt = avatarFile.name.split(".").pop();
          const fileName = `${authData.user.id}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, avatarFile, { upsert: true });

          if (uploadError) throw uploadError;

          const { data: publicUrl } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          avatarUrl = publicUrl?.publicUrl || null;
        }

        avatarUrl = avatarUrl || "/default-avatar.png";

        const profileData = {
          id: authData.user.id, // ✅ Ensure we are using authData.user.id
          nickname: nickname || email.split("@")[0],
          avatar_url: avatarUrl,
        };

        // 🔥 Debugging: Log the profile data before inserting
        console.log("Profile Data:", profileData);

        const { error: profileError } = await supabase
          .from("profiles")
          .insert([profileData]);

        if (profileError) throw profileError;

        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-sm shadow-lg border border-gray-300 bg-white rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-2xl text-center font-semibold text-gray-900 mb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </CardTitle>
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {isSignUp && (
              <>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Label>Nickname (optional)</Label>
                <Input
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <Label>Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                />
              </>
            )}
            {!isSignUp && (
              <>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}
            {error && <Alert variant="destructive">{error}</Alert>}
            <Button
              type="submit"
              disabled={loading}
              variant="default"
              className="w-full py-3"
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
