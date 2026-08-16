export type ProUser = {
  avatar?: string;
  desc?: string;
  id: string;
  nickname: string;
  organizations: string[];
  permission: string[];
  roles: string[];
  tenantId: string;
};

export type AuthRule = {
  anonymous?: boolean;
  organizations?: string[];
  organizationsAny?: string[];
  permissions?: string[];
  permissionsAny?: string[];
  roles?: string[];
  rolesAny?: string[];
  rules?: AuthRule[];
  rulesAny?: AuthRule[];
  tenantIds?: string[];
  tenantIdsAny?: string[];
};

export type ProUserAction = {
  type: "login" | "redirect";
  url?: string;
  value?: ProUser;
};

export type ProUserStoreInitializeOptions = {
  getUser: () => Promise<ProUserAction>;
  keyPrefix?: string;
  logout: () => Promise<ProUserAction>;
};

export type ProUserStoreState = {
  user?: ProUser;
};

export type UseUserStoreResult = {
  allow: (rule: string | string[] | AuthRule) => boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<ProUser>;
  user?: ProUser;
};
