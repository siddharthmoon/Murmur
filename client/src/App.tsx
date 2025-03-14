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

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col h-screen">
      <Header />
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        <IdeaList />
        <IdeaEditor />
      </div>
      <ConfirmDialog />
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
      <IdeaProvider>
        <Router />
        <Toaster />
      </IdeaProvider>
    </QueryClientProvider>
  );
}

export default App;
