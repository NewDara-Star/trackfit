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
      let userId: string | null = null;

      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        // 1️⃣ **Sign up user**
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (signUpError) throw signUpError;
        if (!authData?.user)
          throw new Error("Sign-up successful, but user data is missing");

        console.log("Sign-up successful. Fetching session...");

        // 🔹 Wait for session to be available
        const { data: sessionData } = await supabase.auth.getSession();
        userId = sessionData?.session?.user?.id || null;

        if (!userId)
          throw new Error("Session not available. Try logging in manually.");

        console.log("User ID obtained:", userId);

        // Redirect user to login
        router.push("/login");
      } else {
        // 2️⃣ **User Logs In**
        const { data: authData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;
        if (!authData?.user)
          throw new Error("Sign-up successful, but user data is missing");

        console.log("User created in auth.users:", authData.user.id);

        // ✅ WAIT for the session to confirm user exists
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Small delay to let Supabase register the user

        if (!userId)
          throw new Error("Session not available. Try logging in manually.");

        console.log("User ID confirmed:", userId);
        userId = authData.session.user.id;
        console.log("Login successful, checking profile for user:", userId);

        // 🔹 Check if user profile exists
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .single();

        if (
          !profileData ||
          (profileError &&
            typeof profileError === "object" &&
            "message" in (profileError as unknown as { message?: string }) &&
            (profileError as unknown as { message?: string }).message?.includes(
              "No rows found"
            ))
        ) {
          console.log("No profile found, creating a new profile...");

          // 3️⃣ **Upload avatar if provided**
          let avatarUrl: string | null = null;
          if (avatarFile) {
            const fileExt = avatarFile.name.split(".").pop();
            const fileName = `${userId}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(filePath, avatarFile, { upsert: true });

            if (uploadError) {
              console.error("Avatar upload error:", uploadError);
              throw new Error("Failed to upload avatar.");
            }

            // Get the public URL for the uploaded image
            const { data: publicUrl } = await supabase.storage
              .from("avatars")
              .getPublicUrl(filePath);

            avatarUrl = publicUrl?.publicUrl || null;
          }

          // 4️⃣ **Create Profile in Supabase**
          if (userId) {
            console.log("Creating profile with:", {
              userId,
              nickname,
              avatarUrl,
            });

            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  nickname: nickname || email.split("@")[0], // Default nickname if not provided
                  avatar_url:
                    avatarUrl ||
                    "https://lkmanlvujuoonfgvqlou.supabase.co/storage/v1/object/public/avatars/default-avatar.png", // Ensure avatar URL is stored correctly
                },
              ]);

            if (insertError) {
              console.error("Profile creation error:", insertError.message);
              throw new Error(
                "Could not create profile. Check Supabase policies."
              );
            }

            console.log("Profile created successfully!");
          } else {
            console.error("User ID is missing. Profile creation skipped.");
          }
        }

        // 🔹 Redirect user to dashboard
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
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isSignUp && (
              <>
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
                  placeholder="Enter your nickname"
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
