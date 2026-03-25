import { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import DashboardShell from "@/components/DashboardShell";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DashboardShell />;
};

export default Index;
