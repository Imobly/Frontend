'use client';

import { ProtectedRoute } from '../../components/auth/protected-route';
import { DashboardLayout } from '../../components/dashboard-layout';
import { DashboardOverview } from '../../components/dashboard-overview';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  );
}