import { Header } from '@/components/header';
import { AIChat } from '@/components/ai-chat';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AIChat />
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}