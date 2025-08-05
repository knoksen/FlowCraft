import { Header } from "@/components/layout/header";
import { WorkflowBuilder } from "@/components/workflow/workflow-builder";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WorkflowBuilder />
      </main>
    </div>
  );
}
