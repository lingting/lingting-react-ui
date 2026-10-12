import { PREFIX } from "@lri/global";

const RETRY_STORAGE_KEY = `${PREFIX}/dynamic-load-retry`;
/** 同一轮自动重试的时间窗口（毫秒）：窗口内的连续失败共用额度，超出窗口视为新一轮 */
const RETRY_WINDOW = 30 * 1000;
/** 页内重试（路由替换）次数上限 */
const ROUTE_RETRY_LIMIT = 3;
/** 整页刷新次数上限 */
const RELOAD_RETRY_LIMIT = 3;
/** 浏览器动态加载模块失败时的特征信息 */
const DYNAMIC_LOAD_ERROR_KEYWORDS = [
  "dynamically imported module",
  "Importing a module script failed",
  "Unable to preload CSS",
  "Loading chunk",
];

/** 自动重试方式：`route` 页内重试、`reload` 整页刷新 */
export type DynamicLoadRetryKind = "route" | "reload";

type DynamicLoadRetryState = {
  /** 本轮首次失败时间 */
  at: number;
  /** 已整页刷新次数 */
  reload: number;
  /** 已页内重试次数 */
  route: number;
};

function readState(): DynamicLoadRetryState | undefined {
  try {
    const value = window.sessionStorage.getItem(RETRY_STORAGE_KEY);
    if (!value) return undefined;

    const state = JSON.parse(value) as Partial<DynamicLoadRetryState>;
    if (
      typeof state.at !== "number" ||
      typeof state.reload !== "number" ||
      typeof state.route !== "number"
    ) {
      return undefined;
    }

    return { at: state.at, reload: state.reload, route: state.route };
  } catch {
    // 无法访问 sessionStorage 时按无记录处理
    return undefined;
  }
}

function saveState(state: DynamicLoadRetryState) {
  try {
    window.sessionStorage.setItem(RETRY_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    // 写入失败时不自动重试：额度无法跨刷新保留，继续刷新会陷入无限刷新
    return false;
  }
}

/** 判断异常是否由动态加载模块失败引起 */
export function isDynamicLoadError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return DYNAMIC_LOAD_ERROR_KEYWORDS.some((keyword) => error.message.includes(keyword));
}

/**
 * 申请一次自动重试额度。
 *
 * `routeRetry` 为真时优先返回 `route`（页内重试，上限 3 次），页内额度用尽后返回 `reload`（整页刷新，上限 3 次）；
 * 额度全部用尽返回 `undefined` 并清空记录，调用方应渲染异常组件。
 */
export function takeDynamicLoadRetry(routeRetry: boolean): DynamicLoadRetryKind | undefined {
  const record = readState();
  const state: DynamicLoadRetryState =
    !record || Date.now() - record.at > RETRY_WINDOW
      ? { at: Date.now(), reload: 0, route: 0 }
      : record;

  if (routeRetry && state.route < ROUTE_RETRY_LIMIT) {
    return saveState({ ...state, route: state.route + 1 }) ? "route" : undefined;
  }

  if (state.reload < RELOAD_RETRY_LIMIT) {
    return saveState({ ...state, reload: state.reload + 1 }) ? "reload" : undefined;
  }

  clearDynamicLoadRetry();

  return undefined;
}

/** 清空自动重试额度，使下一次失败重新计数 */
export function clearDynamicLoadRetry() {
  try {
    window.sessionStorage.removeItem(RETRY_STORAGE_KEY);
  } catch {
    // 与 saveState 一致，清除失败无需处理
  }
}
