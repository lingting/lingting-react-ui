import type { AnyRouter } from "@tanstack/react-router";
import { Store, useSelector } from "@tanstack/react-store";

import { PREFIX } from "@lri/global";
import { message } from "@lri/lib";
import type {
  AuthRule,
  ProUser,
  ProUserAction,
  ProUserStoreInitializeOptions,
  ProUserStoreState,
  UseUserStoreResult,
} from "@lri/types";

const DEFAULT_KEY_PREFIX = `${PREFIX}/user-store`;

type ProUserStoreRuntime = Omit<Required<ProUserStoreInitializeOptions>, "keyPrefix"> & {
  keyPrefix: string;
  refreshPromise?: Promise<ProUser>;
  router?: AnyRouter;
  store: Store<ProUserStoreState>;
};

let runtime: ProUserStoreRuntime | undefined;

function normalizeValues(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function includesAll(actual: readonly string[], expected: unknown) {
  return normalizeValues(expected).every((value) => actual.includes(value));
}

function includesAny(actual: readonly string[], expected: unknown) {
  const values = normalizeValues(expected);
  return values.length === 0 || values.some((value) => actual.includes(value));
}

function allowUser(user: ProUser | undefined, rule: AuthRule): boolean {
  if (rule.anonymous === true) return true;
  if (!user) return false;

  const nestedRules = Array.isArray(rule.rules) ? rule.rules : [];
  const nestedRulesAny = Array.isArray(rule.rulesAny) ? rule.rulesAny : [];

  return (
    includesAll(user.roles, rule.roles) &&
    includesAny(user.roles, rule.rolesAny) &&
    includesAll(user.permission, rule.permissions) &&
    includesAny(user.permission, rule.permissionsAny) &&
    includesAll(user.organizations, rule.organizations) &&
    includesAny(user.organizations, rule.organizationsAny) &&
    includesAll([user.tenantId], rule.tenantIds) &&
    includesAny([user.tenantId], rule.tenantIdsAny) &&
    nestedRules.every((item) => allowUser(user, item)) &&
    (nestedRulesAny.length === 0 || nestedRulesAny.some((item) => allowUser(user, item)))
  );
}

function getRuntime() {
  if (!runtime) {
    throw new Error("ProUserStore 尚未初始化，请先调用 ProUserStore.initialize");
  }

  return runtime;
}

function reportRequestError(errorMessage: string, error: unknown) {
  console.error(errorMessage, error);
  const detail = error instanceof Error && error.message.trim() ? error.message : errorMessage;
  void message.error(detail);
}

function createActionError(errorMessage: string, keyPrefix: string) {
  const error = new Error(`${errorMessage}（${keyPrefix}）`);
  console.error(errorMessage, error);
  return error;
}

async function redirectByAction(current: ProUserStoreRuntime, url?: string) {
  const target = url?.trim();
  if (!target) return false;

  if (/^https?:\/\//i.test(target)) {
    try {
      const externalUrl = new URL(target);
      if (externalUrl.protocol !== "http:" && externalUrl.protocol !== "https:") return false;
      window.location.href = target;
      return true;
    } catch {
      return false;
    }
  }

  if (!target.startsWith("/") || target.startsWith("//")) return false;
  if (!current.router) {
    throw new Error("ProUserStore 尚未设置 router，请先渲染 AppSidebarLayout");
  }

  await current.router.navigate({ to: target });
  return true;
}

export class UserStore {
  static initialize(options: ProUserStoreInitializeOptions) {
    runtime = {
      ...options,
      keyPrefix: options.keyPrefix?.trim() || DEFAULT_KEY_PREFIX,
      store: new Store<ProUserStoreState>({}),
    };
  }

  static getStore() {
    return getRuntime().store;
  }

  static setRouter(router: AnyRouter) {
    getRuntime().router = router;
  }

  static allow(rule: string | string[] | AuthRule) {
    const current = getRuntime();
    const resolvedRule =
      typeof rule === "string" || Array.isArray(rule) ? { permissions: [rule].flat() } : rule;
    return allowUser(current.store.state.user, resolvedRule);
  }

  static async refresh(): Promise<ProUser> {
    const current = getRuntime();
    if (current.refreshPromise) return current.refreshPromise;

    const request = (async () => {
      let action: ProUserAction;
      try {
        action = await current.getUser();
      } catch (error) {
        reportRequestError("刷新用户信息失败", error);
        throw error;
      }

      if (action.type === "login" && action.value) {
        current.store.setState(() => ({ user: action.value }));
        return action.value;
      }

      current.store.setState(() => ({}));
      if (action.type === "redirect") await redirectByAction(current, action.url);
      throw createActionError("未获取到有效用户信息", current.keyPrefix);
    })();

    current.refreshPromise = request;
    try {
      return await request;
    } finally {
      if (current.refreshPromise === request) current.refreshPromise = undefined;
    }
  }

  static async logout(): Promise<void> {
    const current = getRuntime();
    let action: ProUserAction;
    try {
      action = await current.logout();
    } catch (error) {
      reportRequestError("退出登录失败", error);
      throw error;
    }

    if (action.type === "login" && action.value) {
      current.store.setState(() => ({ user: action.value }));
      return;
    }

    current.store.setState(() => ({}));
    if (action.type === "redirect") await redirectByAction(current, action.url);
    if (action.type === "login") {
      throw createActionError("退出登录后未返回有效用户信息", current.keyPrefix);
    }
  }
}

const allow = UserStore.allow.bind(UserStore);
const logout = UserStore.logout.bind(UserStore);
const refresh = UserStore.refresh.bind(UserStore);

export function useUserStore(): UseUserStoreResult {
  const store = UserStore.getStore();
  const user = useSelector(store, (state) => state.user);

  return { allow, logout, refresh, user };
}
