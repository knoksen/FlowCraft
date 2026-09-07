
"use client";

import { useAuth } from "@/auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { Bell, HelpCircle, LogIn, LogOut, User, Workflow, Save, Play, Bot, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkflowStore } from "../workflow/workflowStore";
import { useToast } from "@/hooks/use-toast";
import { saveWorkflow } from "@/ai/flows/save-workflow";
import { executeWorkflow } from "@/ai/flows/execute-workflow";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { nodes, edges, workflowId, setWorkflowId } = useWorkflowStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);


  const handleSignOut = async () => {
    if (!auth) {
      return;
    }

    await auth.signOut();
    router.push('/signin');
  };

  const handleSignIn = () => {
    router.push('/signin');
  }

  const handleSaveWorkflow = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Signed In",
        description: "You must be signed in to save a workflow.",
      });
      return null;
    }
    
    setIsSaving(true);
    toast({
      title: "Saving...",
      description: "Your workflow is being saved.",
    });

    try {
      // Note: LucideIcon component cannot be serialized, so we remove it.
      const nodesToSave = nodes.map(({ icon, ...restarted }) => restarted);
      
      const result = await saveWorkflow({
        userId: user.uid,
        workflowId: workflowId || undefined,
        name: "My Awesome Workflow", // Placeholder name
        nodes: nodesToSave,
        edges,
      });

      if (result.status === 'success') {
        toast({
          title: "Success!",
          description: result.message,
        });
        if (result.workflowId && !workflowId) {
            setWorkflowId(result.workflowId);
        }
        return result.workflowId;
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Saving Workflow",
        description: error.message || "An unexpected error occurred.",
      });
      return null;
    } finally {
        setIsSaving(false);
    }
  }
  
  const handleRunWorkflow = async () => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Not Signed In",
          description: "You must be signed in to run a workflow.",
        });
        return;
      }
      
      setIsRunning(true);
      
      // We must save before we run to ensure we execute the latest version
      const savedWorkflowId = await handleSaveWorkflow();
      
      if (!savedWorkflowId) {
          toast({
              variant: "destructive",
              title: "Run Failed",
              description: "Could not save the workflow before running. Please try saving manually first.",
          });
          setIsRunning(false);
          return;
      }

      toast({
          title: "Executing Workflow",
          description: `Kicking off workflow ${savedWorkflowId.substring(0, 6)}...`,
      });

      try {
          const result = await executeWorkflow({
              workflowId: savedWorkflowId,
              userId: user.uid,
          });
          toast({
              title: "Execution Started",
              description: `Execution ID: ${result.executionId.substring(0,6)}... is ${result.status}`,
          });
      } catch (error: any) {
           toast({
              variant: "destructive",
              title: "Execution Error",
              description: error.message || "An unexpected error occurred.",
          });
      } finally {
          setIsRunning(false);
      }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Workflow className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">FlowCraft</h1>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline">
                <Bot size={16} className="mr-2" />
                AI Assist
            </Button>
            <Button variant="outline" onClick={handleSaveWorkflow} disabled={isSaving || isRunning}>
                {isSaving ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Save size={16} className="mr-2" />}
                Save
            </Button>
             <Button onClick={handleRunWorkflow} disabled={isSaving || isRunning}>
                {isRunning ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Play size={16} className="mr-2" />}
                Run
            </Button>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" aria-label="Help">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {loading ? (
             <Skeleton className="h-9 w-9 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={handleSignIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
