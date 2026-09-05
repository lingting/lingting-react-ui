import type { IntlType } from "@ant-design/pro-components";
import { App, message as staticMessage, Modal, notification as staticNotification } from "antd";
import { QueryClient } from "@tanstack/react-query";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { HookAPI as ModalHookAPI } from "antd/es/modal/useModal";
import type { AnyRouter } from "@tanstack/react-router";

type AntdAppInstance = ReturnType<typeof App.useApp>;

type AppIntl = IntlType & {
  format: (id: string, defaultMessage?: string) => string;
};

type AppHolderBasicValues<I> = {
  message: MessageInstance;
  notification: NotificationInstance;
  modal: ModalHookAPI;
  query: QueryClient;
  intl: I;
  router: AnyRouter | null;
};

export type AppHolderValues = AppHolderBasicValues<IntlType>;

type AppStackValues = AppHolderBasicValues<AppIntl>;

type AppHolderKey = keyof AppHolderValues;

const initToken = Symbol("init");
const stacks: { [TKey in AppHolderKey]: Array<{ token: symbol; value: AppStackValues[TKey] }> } = {
  message: [{ token: initToken, value: staticMessage }],
  notification: [{ token: initToken, value: staticNotification }],
  modal: [{ token: initToken, value: Modal as unknown as AntdAppInstance["modal"] }],
  intl: [],
  query: [
    {
      token: initToken,
      value: new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
    },
  ],
  router: [{ token: initToken, value: null }],
};

function getMounted<TKey extends AppHolderKey>(key: TKey): AppStackValues[TKey] | null {
  let value = stacks[key].at(-1)?.value;
  return value === undefined ? null : value;
}

function getRequiredMounted<TKey extends AppHolderKey>(
  key: TKey,
  message: string,
): AppStackValues[TKey] {
  const value = getMounted(key);
  if (value === null) throw new Error(message);
  return value;
}

function createInstanceProxy<TInstance extends object>(getInstance: () => TInstance): TInstance {
  return new Proxy({} as TInstance, {
    get(_target, property) {
      const instance = getInstance();
      const value = Reflect.get(instance, property, instance);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

function mount(values: Partial<AppHolderValues>) {
  const token = Symbol("AppHolder");
  const mountedKeys: AppHolderKey[] = [];

  let keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as AppHolderKey;
    let value = values[key];
    if (!value || !stacks[key]) {
      continue;
    }
    if (key === "intl") {
      let v = value as IntlType;
      value = {
        // @ts-ignore
        format(id: string, defaultMessage?: string): string {
          return v.getMessage(id, defaultMessage || id);
        },
        ...v,
      };
    }
    // @ts-ignore
    stacks[key].push({ token, value });
    mountedKeys.push(key);
  }

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;

    mountedKeys.forEach((key) => {
      const index = stacks[key].findIndex((entry) => entry.token === token);
      if (index >= 0) stacks[key].splice(index, 1);
    });
  };
}

export const message = createInstanceProxy(() =>
  getRequiredMounted(
    "message",
    "AppHolder.message is unavailable. Mount it inside BasicLayout first.",
  ),
);
export const modal = createInstanceProxy(() =>
  getRequiredMounted("modal", "AppHolder.modal is unavailable. Mount it inside BasicLayout first."),
);
export const notification = createInstanceProxy(() =>
  getRequiredMounted(
    "notification",
    "AppHolder.notification is unavailable. Mount it inside BasicLayout first.",
  ),
);
export const intl = createInstanceProxy(() => {
  return getRequiredMounted(
    "intl",
    "AppHolder.intl is unavailable. Mount it inside BasicLayout first.",
  );
});
export const query = createInstanceProxy(() =>
  getRequiredMounted(
    "query",
    "AppHolder.query is unavailable. Mount it inside QueryClientProvider and BasicLayout first.",
  ),
);
export const router = (): AnyRouter | null => getMounted("router");

const consumerQueries = (consumer: (query: QueryClient) => void) => {
  for (let query of stacks.query) {
    consumer(query.value);
  }
};

export const AppHolder = { mount, message, modal, notification, intl, query, router, consumerQueries };
