"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Calendar, DollarSign, Wrench, CheckCircle, X, Eye } from "lucide-react"
import { NotificationFilters } from "./notification-filters"

interface Notification {
  id: string
  type: "contract_expiring" | "payment_overdue" | "maintenance_urgent" | "system_alert" | "reminder"
  title: string
  message: string
  date: string
  priority: "low" | "medium" | "high" | "urgent"
  read: boolean
  actionRequired: boolean
  relatedId?: string
  relatedType?: "contract" | "payment" | "maintenance" | "property"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "contract_expiring",
    title: "Contrato vencendo em breve",
    message: "O contrato do inquilino João Silva (Apartamento Centro - Apt 101) vence em 15 dias.",
    date: "2024-01-20T10:30:00",
    priority: "high",
    read: false,
    actionRequired: true,
    relatedId: "1",
    relatedType: "contract",
  },
  {
    id: "2",
    type: "payment_overdue",
    title: "Pagamento em atraso",
    message: "Aluguel de Maria Santos (Casa Jardins) está 5 dias em atraso. Valor: R$ 2.500,00",
    date: "2024-01-19T14:15:00",
    priority: "urgent",
    read: false,
    actionRequired: true,
    relatedId: "2",
    relatedType: "payment",
  },
  {
    id: "3",
    type: "maintenance_urgent",
    title: "Manutenção urgente",
    message: "Vazamento reportado no Apartamento Centro - Apt 205. Prioridade: Urgente",
    date: "2024-01-19T09:45:00",
    priority: "urgent",
    read: false,
    actionRequired: true,
    relatedId: "3",
    relatedType: "maintenance",
  },
  {
    id: "4",
    type: "reminder",
    title: "Lembrete: Reajuste de aluguel",
    message: "Aplicar reajuste de 5% no contrato de Pedro Costa a partir de 01/02/2024",
    date: "2024-01-18T16:20:00",
    priority: "medium",
    read: true,
    actionRequired: true,
    relatedId: "4",
    relatedType: "contract",
  },
  {
    id: "5",
    type: "system_alert",
    title: "Backup realizado com sucesso",
    message: "Backup automático dos dados foi concluído às 02:00",
    date: "2024-01-18T02:00:00",
    priority: "low",
    read: true,
    actionRequired: false,
  },
]

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filters, setFilters] = useState({
    type: "all",
    priority: "all",
    read: "all",
    actionRequired: "all",
  })

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filters.type === "all" || notification.type === filters.type
    const matchesPriority = filters.priority === "all" || notification.priority === filters.priority
    const matchesRead =
      filters.read === "all" ||
      (filters.read === "read" && notification.read) ||
      (filters.read === "unread" && !notification.read)
    const matchesAction =
      filters.actionRequired === "all" ||
      (filters.actionRequired === "required" && notification.actionRequired) ||
      (filters.actionRequired === "not_required" && !notification.actionRequired)

    return matchesType && matchesPriority && matchesRead && matchesAction
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentCount = notifications.filter((n) => n.priority === "urgent" && !n.read).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contract_expiring":
        return <Calendar className="h-4 w-4" />
      case "payment_overdue":
        return <DollarSign className="h-4 w-4" />
      case "maintenance_urgent":
        return <Wrench className="h-4 w-4" />
      case "system_alert":
        return <Bell className="h-4 w-4" />
      case "reminder":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "contract_expiring":
        return "Contrato"
      case "payment_overdue":
        return "Pagamento"
      case "maintenance_urgent":
        return "Manutenção"
      case "system_alert":
        return "Sistema"
      case "reminder":
        return "Lembrete"
      default:
        return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-danger text-danger-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-warning text-warning-foreground"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgente"
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Notificações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
            <Bell className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ação Necessária</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionRequiredCount}</div>
            <p className="text-xs text-muted-foreground">Aguardando ação</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <NotificationFilters filters={filters} onFiltersChange={setFilters} />

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredNotifications.length} de {notifications.length} notificações
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all ${!notification.read ? "border-l-4 border-l-primary bg-muted/20" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary/10"}`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {notification.title}
                      </h3>
                      <Badge variant="outline">{getTypeText(notification.type)}</Badge>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {getPriorityText(notification.priority)}
                      </Badge>
                      {notification.actionRequired && <Badge variant="secondary">Ação necessária</Badge>}
                      {!notification.read && <Badge className="bg-primary text-primary-foreground">Nova</Badge>}
                    </div>

                    <p className="text-sm text-muted-foreground">{notification.message}</p>

                    <div className="text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-danger hover:text-danger"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma notificação encontrada</h3>
            <p className="text-muted-foreground">Não há notificações que correspondam aos filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
