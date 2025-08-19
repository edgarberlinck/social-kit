import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SocialMediaScheduler from "@/components/SocialMediaScheduler";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <DashboardLayout>
      <SocialMediaScheduler />
    </DashboardLayout>
  );
};

export default Index;
