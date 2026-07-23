import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar"
import { Button } from "@/components/shadcn/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/ui/tooltip"

import type { AppSidebarLayoutUser as AppSidebarLayoutUserValue } from "./AppSidebarLayoutTypes"

interface AppSidebarLayoutUserProps {
  user: AppSidebarLayoutUserValue
}

export function AppSidebarLayoutUser({ user }: AppSidebarLayoutUserProps) {
  const logout = user.logout
  const inlineLogout = logout?.position !== "bottom" ? logout : undefined

  return (
    <div className="app-sidebar-layout-user">
      <Avatar className="app-sidebar-layout-user__avatar" size="lg">
        {user.avatar && <AvatarImage alt="" src={user.avatar} />}
        <AvatarFallback>{user.nickname}</AvatarFallback>
      </Avatar>
      <div className="app-sidebar-layout-user__content">
        <div className="app-sidebar-layout-user__name">{user.nickname}</div>
        {user.description && (
          <div className="app-sidebar-layout-user__description">
            {user.description}
          </div>
        )}
      </div>
      {inlineLogout && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="退出"
              className="app-sidebar-layout-user__logout-icon"
              onClick={inlineLogout.onClick}
              size="icon-sm"
              type="button"
            >
              {inlineLogout.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{inlineLogout.text}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
