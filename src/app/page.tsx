import { Header } from "@/components/layout/header";
import Layout from "@/components/layout/layout";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Layout>
            {/* The content is now inside the layout */}
        </Layout>
      </main>
    </div>
  );
}
