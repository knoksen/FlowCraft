
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { SidebarItem } from "./sidebar-item";
import { AVAILABLE_STEPS } from "@/lib/steps";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export function Sidebar() {
  return (
    <aside className="w-80 border-r bg-background p-4 flex flex-col gap-4">
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Workflow Steps</CardTitle>
                <CardDescription>Drag steps onto the canvas to build your flow.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 flex-1">
                <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_STEPS.map((step) => (
                            <SidebarItem key={step.type} step={step} />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </aside>
  );
}
