// src/features/institution-dashboard/index.tsx
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { TemplateSelection } from "./components/template-selection";
import { ProgressDashboard } from "./components/progress-dashboard";
import type { Template } from "./data/schema";
import { useInstitutionDashboard, useSelectTemplate } from "@/api/hooks/institution";
import { useTemplates } from "@/api/hooks/templates";
import { useRoleGuard } from "@/guards/useRoleGuard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoading: guardLoading, isAllowed } = useRoleGuard(['institution']);
  const { data: dashboardData, isLoading, error } = useInstitutionDashboard();
  const { data: templatesData, isLoading: templatesLoading } = useTemplates();
  const selectTemplate = useSelectTemplate();

  const handleTemplateSelect = async (selectedTemplate: Template) => {
    try {
      await selectTemplate.mutateAsync({ templateId: selectedTemplate.id });
    } catch (error) {
      console.error('Failed to select template:', error);
    }
  };

  const handleCreatePhase = () => {
    navigate({ to: "/dashboard/phases" });
  };

  const handleViewSubmissions = () => {
    navigate({ to: "/institutions/submissions" });
  };

  // Show loading while checking auth or fetching data
  if (guardLoading || isLoading || templatesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if failed to load (but keep user logged in)
  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg">⚠️ Error</div>
          <p className="text-muted-foreground">
            Unable to load dashboard data. The API might not be available yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Error: {error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if role guard blocks access
  if (!isAllowed) {
    return null;
  }

  // If no dashboard data (API not ready), show template selection for first-time setup
  if (!dashboardData || !dashboardData.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TemplateSelection
          templates={templatesData?.data?.templates || []}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
    );
  }

  const { institution, stats, phases } = dashboardData.data;

  // Show template selection if no template selected
  if (!institution?.selectedTemplateId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TemplateSelection
          templates={templatesData?.data?.templates || []}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
    );
  }

  // Convert API data to component format
  const progressData = {
    institutionId: institution.id,
    institutionName: institution.name,
    selectedTemplateId: institution.selectedTemplateId,
    selectedTemplate: null,
    totalPhases: stats.totalPhases,
    completedPhases: stats.completedPhases,
    inProgressPhases: stats.inProgressPhases,
    pendingPhases: stats.pendingPhases,
    totalSubmissions: stats.totalSubmissions,
    completedSubmissions: stats.completedSubmissions,
    pendingSubmissions: stats.pendingSubmissions,
    completionPercentage: stats.completionPercentage,
    lastActivity: stats.lastActivity || '',
  };

  // Show progress dashboard if template already selected
  return (
    <div className="container mx-auto px-4 py-6">
      <ProgressDashboard
        progress={progressData}
        phases={phases}
        onCreatePhase={handleCreatePhase}
        onViewSubmissions={handleViewSubmissions}
      />
    </div>
  );
}
