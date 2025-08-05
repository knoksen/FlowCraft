
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Welcome to FlowCraft</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            The intuitive, AI-powered platform for building and automating your workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Jump into the visual designer to connect apps, add logic, and bring your automated processes to life.
          </p>
          <Button asChild size="lg">
            <Link href="/workflows">
              Go to Workflow Designer <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
