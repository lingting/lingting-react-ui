import type { AnyRouter } from "@tanstack/react-router";
import { Store, useSelector } from "@tanstack/react-store";

import { PREFIX } from "@lri/global";
import { allowUser, message } from "@lri/lib";
import type {
  AuthRule,
  User,
  UserAction,
  UserStoreInitializeOptions,
  UserStoreState,
  UseUserStoreResult,
} from "@lri/types";

const DEFAULT_KEY_PREFIX = `${PREFIX}/user-store`;

type UserStoreRuntime = Omit<Required<UserStoreInitializeOptions>, "keyPrefix"> & {
  keyPrefix: string;
  refreshPromise?: Promise<User>;
  router?: AnyRouter;
  store: Store<UserStoreState>;
};

let runtime: UserStoreRuntime | undefined;

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

async function redirectByAction(current: UserStoreRuntime, url?: string) {
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
  static initialize(options: UserStoreInitializeOptions) {
    runtime = {
      ...options,
      keyPrefix: options.keyPrefix?.trim() || DEFAULT_KEY_PREFIX,
      store: new Store<UserStoreState>({ loading: true }),
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

  static async refresh(): Promise<User> {
    const current = getRuntime();
    if (current.refreshPromise) return current.refreshPromise;

    current.store.setState((state) => ({ ...state, loading: true }));
    const request = (async () => {
      let action: UserAction;
      try {
        action = await current.getUser();
      } catch (error) {
        reportRequestError("刷新用户信息失败", error);
        throw error;
      }

      if (action.type === "login" && action.value) {
        current.store.setState((state) => ({ ...state, user: action.value }));
        return action.value;
      }

      current.store.setState((state) => ({ ...state, user: undefined }));
      if (action.type === "redirect") await redirectByAction(current, action.url);
      throw createActionError("未获取到有效用户信息", current.keyPrefix);
    })();

    current.refreshPromise = request;
    try {
      return await request;
    } finally {
      current.store.setState((state) => ({ ...state, loading: false }));
      if (current.refreshPromise === request) current.refreshPromise = undefined;
    }
  }

  static async logout(): Promise<void> {
    const current = getRuntime();
    let action: UserAction;
    try {
      action = await current.logout();
    } catch (error) {
      reportRequestError("退出登录失败", error);
      throw error;
    }

    if (action.type === "login" && action.value) {
      current.store.setState((state) => ({ ...state, user: action.value }));
      return;
    }

    current.store.setState((state) => ({ ...state, user: undefined }));
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
  const loading = useSelector(store, (state) => state.loading);
  const user = useSelector(store, (state) => state.user);

  return { allow, loading, logout, refresh, user };
}
