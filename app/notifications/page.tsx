import { DashboardLayout } from "@/components/dashboard-layout"
import { NotificationsView } from "@/components/notifications/notifications-view"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
        <p className="text-muted-foreground mt-2">Acompanhe alertas importantes e status do sistema</p>
      </div>
      <NotificationsView />
    </DashboardLayout>
  )
}
