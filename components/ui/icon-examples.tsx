"use client"
import { Home, Settings, User, Bell, AlertTriangle, CheckCircle, XCircle, FileText, Search, Menu } from "lucide-react"
import { Icon, createIcon } from "./icon"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

// Crear iconos preconfigurados para uso común
const HomeIcon = createIcon(Home)
const SettingsIcon = createIcon(Settings)
const UserIcon = createIcon(User)
const BellIcon = createIcon(Bell)
const AlertIcon = createIcon(AlertTriangle, { color: "warning" })
const SuccessIcon = createIcon(CheckCircle, { color: "success" })
const ErrorIcon = createIcon(XCircle, { color: "danger" })
const FileIcon = createIcon(FileText, { color: "secondary" })
const SearchIcon = createIcon(Search, { color: "muted" })
const MenuIcon = createIcon(Menu)

export function IconShowcase() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tamaños de iconos</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end gap-4">
          <div className="flex flex-col items-center">
            <Icon icon={Home} size="xs" />
            <span className="text-xs mt-1">xs</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Home} size="sm" />
            <span className="text-xs mt-1">sm</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Home} size="md" />
            <span className="text-xs mt-1">md</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Home} size="lg" />
            <span className="text-xs mt-1">lg</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Home} size="xl" />
            <span className="text-xs mt-1">xl</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Home} size="2xl" />
            <span className="text-xs mt-1">2xl</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colores de iconos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="primary" size="lg" />
            <span className="text-xs mt-1">primary</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="secondary" size="lg" />
            <span className="text-xs mt-1">secondary</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="accent" size="lg" />
            <span className="text-xs mt-1">accent</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="muted" size="lg" />
            <span className="text-xs mt-1">muted</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="success" size="lg" />
            <span className="text-xs mt-1">success</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="warning" size="lg" />
            <span className="text-xs mt-1">warning</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="danger" size="lg" />
            <span className="text-xs mt-1">danger</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={Bell} color="neutral" size="lg" />
            <span className="text-xs mt-1">neutral</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Iconos preconfigurados</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col items-center">
            <HomeIcon size="lg" />
            <span className="text-xs mt-1">HomeIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <SettingsIcon size="lg" />
            <span className="text-xs mt-1">SettingsIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <UserIcon size="lg" />
            <span className="text-xs mt-1">UserIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <AlertIcon size="lg" />
            <span className="text-xs mt-1">AlertIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <SuccessIcon size="lg" />
            <span className="text-xs mt-1">SuccessIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <ErrorIcon size="lg" />
            <span className="text-xs mt-1">ErrorIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <FileIcon size="lg" />
            <span className="text-xs mt-1">FileIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <SearchIcon size="lg" />
            <span className="text-xs mt-1">SearchIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <MenuIcon size="lg" />
            <span className="text-xs mt-1">MenuIcon</span>
          </div>
          <div className="flex flex-col items-center">
            <BellIcon size="lg" color="accent" />
            <span className="text-xs mt-1">BellIcon</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
