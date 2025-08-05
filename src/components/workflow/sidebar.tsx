
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { SidebarItem } from "./sidebar-item";
import { AVAILABLE_STEPS } from "@/lib/steps";
import { ScrollArea } from "../ui/scroll-area";

export function Sidebar() {
  return (
    <aside className="w-80 border-r bg-background p-4 flex flex-col gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Workflow Steps</CardTitle>
                <CardDescription>Drag and drop steps onto the canvas to build your workflow.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="grid grid-cols-1 gap-2">
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
