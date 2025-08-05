
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, githubProvider, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { Chrome, Github } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async (provider: typeof googleProvider | typeof githubProvider) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to FlowCraft</CardTitle>
          <CardDescription>Sign in to continue to your workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={() => handleSignIn(googleProvider)}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleSignIn(githubProvider)}
            >
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
