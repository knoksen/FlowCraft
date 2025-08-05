
"use client";

import { useAuth } from "@/auth/auth-provider";
import Layout from "@/components/layout/layout";
import { Header } from "@/components/layout/header";
import SignIn from "@/app/signin/page";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Layout user={user}/>
    </div>
  );
}
