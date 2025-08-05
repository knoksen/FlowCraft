
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot, type Timestamp } from "firebase/firestore";
import type { ExecutionLog } from "@/lib/types";
import { CheckCircle, Loader2, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ExecutionHistoryProps = {
  userId: string;
};

const statusIcons = {
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
  running: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
};

const statusColors: Record<string, "default" | "destructive" | "secondary"> = {
    success: "default",
    failed: "destructive",
    running: "secondary",
}

export function ExecutionHistory({ userId }: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "executionLogs"),
      where("userId", "==", userId),
      orderBy("startedAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startedAt: (data.startedAt as Timestamp).toDate(),
                finishedAt: data.finishedAt ? (data.finishedAt as Timestamp).toDate() : undefined,
            } as ExecutionLog
        });
        setExecutions(logs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching execution logs:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Execution History</CardTitle>
        <CardDescription>View the status of your recent workflow runs.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No executions yet.</p>
              <p className="text-sm">Run a workflow to see its history here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((log) => (
                <div key={log.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted">
                   <div className="flex-shrink-0">
                     {statusIcons[log.status]}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">Execution {log.id.substring(0,6)}...</p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                       <Clock className="h-3 w-3" />
                       {formatDistanceToNow(log.startedAt, { addSuffix: true })}
                     </p>
                   </div>
                   <Badge variant={statusColors[log.status] || "secondary"} className="capitalize">
                     {log.status}
                   </Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
