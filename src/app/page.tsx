"use client";

import { Header } from "@/components/layout/header";
import Layout from "@/components/layout/layout";
import { useAuth } from "@/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Workflow } from "lucide-react";
import WorkflowCanvas from "@/components/workflow/workflow-canvas";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
       <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
     return (
       <div className="flex flex-col min-h-screen bg-background text-foreground">
         <Header />
         <main className="flex-1 flex items-center justify-center">
           <div className="text-center p-8">
             <Workflow className="mx-auto h-16 w-16 text-primary" />
             <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
               Welcome to FlowCraft
             </h1>
             <p className="mt-4 text-lg text-muted-foreground">
               Visually build, automate, and manage your workflows with AI-powered suggestions.
             </p>
             <div className="mt-8">
               <Button size="lg" onClick={() => router.push('/signin')}>
                 Get Started
               </Button>
             </div>
           </div>
         </main>
       </div>
     );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-8">
        <WorkflowCanvas />
      </main>
    </div>
  );
}
