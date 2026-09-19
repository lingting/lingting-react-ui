import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Popconfirm, Typography } from "antd";
import React, { useCallback, useMemo } from "react";

import { useUserStore } from "@lri/store";
import type { User } from "@lri/types";

import { SidebarCollapsed, useSidebarLayout } from "../SidebarLayout";
import type { SidebarLogoutPosition } from "./SidebarTypes";
import "./SidebarUser.css";

export type SidebarUserItemProps = {
  className?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  onClick?: () => void;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "content" | "onClick" | "className"
>;

export const SidebarUserItem = React.forwardRef<HTMLDivElement, SidebarUserItemProps>(
  ({ className, onClick, icon, content, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={`sidebar-user-item ${className || ""}`}
        onClick={onClick}
      >
        <div className={"sidebar-user-item-icon"}>{icon}</div>
        {content && <div className={"sidebar-user-item-content"}>{content}</div>}
      </div>
    );
  },
);
SidebarUserItem.displayName = "SidebarUserItem";

export type SidebarUserProps = {
  user: User;
  logoutPosition?: SidebarLogoutPosition;
};

export const SidebarUser = ({ user, logoutPosition }: SidebarUserProps) => {
  const { collapsed } = useSidebarLayout();
  const icon = useMemo(
    () => <Avatar icon={!user.avatar ? <UserOutlined /> : undefined} src={user.avatar} size={32} />,
    [user],
  );

  const content = useMemo(() => {
    const text = (
      <div className="sidebar-user-text">
        <Typography.Text ellipsis>{user.nickname}</Typography.Text>
        {user.desc ? (
          <Typography.Text ellipsis type="secondary">
            {user.desc}
          </Typography.Text>
        ) : null}
      </div>
    );

    if (logoutPosition !== "user") {
      return text;
    }

    return (
      <div className={"sidebar-user-wrapper"}>
        {text}
        <SidebarUserLogout onlyIcon={true} />
      </div>
    );
  }, [user, logoutPosition]);

  return (
    <SidebarUserItem
      className={"sidebar-user-root"}
      icon={icon}
      content={collapsed === SidebarCollapsed.Expanded ? content : undefined}
    />
  );
};

export type SidebarUserLogoutProps = {
  onlyIcon?: boolean;
};

export const SidebarUserLogout = ({ onlyIcon }: SidebarUserLogoutProps) => {
  const { collapsed } = useSidebarLayout();
  const { logout } = useUserStore();
  const handleLogout = useCallback(() => void logout().catch(() => undefined), [logout]);
  const content = useMemo(() => <Typography.Text>退出登录</Typography.Text>, []);

  return (
    <Popconfirm
      description="确认要退出登录吗?"
      onConfirm={handleLogout}
      title="退出登录"
      trigger={["click"]}
    >
      <SidebarUserItem
        icon={<LogoutOutlined />}
        content={collapsed === SidebarCollapsed.Expanded && !onlyIcon ? content : undefined}
      />
    </Popconfirm>
  );
};
