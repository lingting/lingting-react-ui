export type User = {
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

export type UserAction = {
  type: "login" | "redirect";
  url?: string;
  value?: User;
};

export type UserStoreInitializeOptions = {
  getUser: () => Promise<UserAction>;
  keyPrefix?: string;
  logout: () => Promise<UserAction>;
};

export type UserStoreState = {
  loading: boolean;
  user?: User;
};

export type UseUserStoreResult = {
  allow: (rule: string | string[] | AuthRule) => boolean;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  refresh: () => Promise<User>;
  loading: boolean;
  user?: User;
};
