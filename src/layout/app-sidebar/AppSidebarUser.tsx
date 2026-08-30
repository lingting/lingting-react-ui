import { Avatar, Popconfirm, Typography } from "antd";
import React, { useCallback, useMemo } from "react";
import { AppSidebarLogoutPosition, useSidebarLayout } from "@lri/layout";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { User } from "@lri/types";
import { useUserStore } from "@lri/store";

export type AppSidebarUserItemProps = {
  className?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  onClick?: () => void;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "content" | "onClick" | "className"
>;

export const AppSidebarUserItem = React.forwardRef<HTMLDivElement, AppSidebarUserItemProps>(
  ({ className, onClick, icon, content, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={`app-sidebar-layout__user-item ${className || ""}`}
        onClick={onClick}
      >
        <div className={"app-sidebar-layout__user-item-icon"}>{icon}</div>
        {content && <div className={"app-sidebar-layout__user-item-content"}>{content}</div>}
      </div>
    );
  },
);
AppSidebarUserItem.displayName = "AppSidebarUserItem";

export type AppSidebarUserProps = {
  user: User;
  logoutPosition?: AppSidebarLogoutPosition;
};

export const AppSidebarUser = ({ user, logoutPosition }: AppSidebarUserProps) => {
  const { collapsed } = useSidebarLayout();
  const icon = useMemo(
    () => <Avatar icon={!user.avatar ? <UserOutlined /> : undefined} src={user.avatar} size={32} />,
    [user],
  );

  const content = useMemo(() => {
    const text = (
      <div className="app-sidebar-layout__user-text">
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
      <div className={"app-sidebar-layout__user-wrapper"}>
        {text}
        <AppSidebarUserLogout onlyIcon={true} />
      </div>
    );
  }, [user, logoutPosition]);

  return (
    <AppSidebarUserItem
      className={"app-sidebar-layout__user-root"}
      icon={icon}
      content={collapsed === "expanded" ? content : undefined}
    />
  );
};

export type AppSidebarUserLogoutProps = {
  onlyIcon?: boolean;
};

export const  AppSidebarUserLogout = ({ onlyIcon }: AppSidebarUserLogoutProps) => {
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
      <AppSidebarUserItem
        icon={<LogoutOutlined />}
        content={collapsed === "expanded" && !onlyIcon ? content : undefined}
      />
    </Popconfirm>
  );
};
