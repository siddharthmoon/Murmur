import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import IdeaList from "@/components/IdeaList";
import IdeaEditor from "@/components/IdeaEditor";
import ConfirmDialog from "@/components/ConfirmDialog";
import { IdeaProvider } from "@/context/IdeaContext";
import { ThemeProvider } from "@/context/ThemeContext";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 overflow-hidden">
          <IdeaList />
        </div>
        <IdeaEditor />
        <ConfirmDialog />
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <IdeaProvider>
          <Router />
          <Toaster />
        </IdeaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
