
import WorkflowCanvas from "@/components/workflow/workflow-canvas";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Visual Workflow Designer</h1>
      <WorkflowCanvas />
    </div>
  );
}
