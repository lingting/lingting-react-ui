import type { ReactNode } from "react";

import type { DictData, DictItem, DictValue } from "@lri/types";
import { PresetColors } from "antd/es/theme/interface/presetColors";

const presetColors = PresetColors as unknown as readonly string[];
const semanticColorAliases: Record<string, string> = {
  primary: "colorPrimary",
  success: "colorSuccess",
  warning: "colorWarning",
  error: "colorError",
  info: "colorInfo",
  text: "colorText",
  textSecondary: "colorTextSecondary",
  border: "colorBorder",
  bgContainer: "colorBgContainer",
};

export type NormalizedDictItem<T extends DictValue = DictValue> = DictItem<T> & {
  label: ReactNode;
};

function isPrimitive(value: unknown): value is DictValue {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function normalizeObjectItem<T extends DictValue>(
  value: Record<string, unknown>,
  fallbackValue: T,
): NormalizedDictItem<T> {
  const rawValue = isPrimitive(value.value) ? (value.value as T) : fallbackValue;
  return {
    value: rawValue,
    label: (value.label as ReactNode | null | undefined) ?? rawValue,
    disabled: value.disabled === true,
    color: typeof value.color === "string" ? value.color : undefined,
    badgeColor: typeof value.badgeColor === "string" ? value.badgeColor : undefined,
    tagColor: typeof value.tagColor === "string" ? value.tagColor : undefined,
    textColor: typeof value.textColor === "string" ? value.textColor : undefined,
    badgeStatus: ["success", "processing", "default", "error", "warning"].includes(
      String(value.badgeStatus),
    )
      ? (value.badgeStatus as DictItem["badgeStatus"])
      : undefined,
  };
}

export function normalizeDictData<T extends DictValue>(dict: DictData<T>): NormalizedDictItem<T>[] {
  if (Array.isArray(dict)) {
    const values = dict as unknown[];
    if (values.length === 0) return [];
    if (isPrimitive(values[0])) {
      return values.filter(isPrimitive).map((value) => ({ label: value, value: value as T }));
    }
    return values.map((item) =>
      normalizeObjectItem(
        item as Record<string, unknown>,
        (item as Record<string, unknown>).value as T,
      ),
    );
  }

  return Object.entries(dict as Record<string, unknown>).map(([key, value]) => {
    if (isPrimitive(value)) return { label: key, value: value as T };
    if (value && typeof value === "object")
      return normalizeObjectItem(value as Record<string, unknown>, key as T);
    return { label: key, value: key as T };
  });
}

export function toDictOptions<T extends DictValue>(dict: DictData<T>) {
  return normalizeDictData(dict).map((item) => ({
    disabled: item.disabled,
    label: item.label,
    value: item.value,
  }));
}

export function findDictItem<T extends DictValue>(dict: DictData<T>, value: T | null | undefined) {
  if (value === null || value === undefined) return undefined;
  return findDictItemByData(normalizeDictData(dict), value);
}

export function findDictItemByData<T extends DictValue>(
  data: NormalizedDictItem<T>[],
  value: T | null | undefined,
) {
  if (value === null || value === undefined) return undefined;
  return data.find((item) => item.value === value);
}

function isExplicitCssColor(value: string) {
  return (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    value.startsWith("var(") ||
    value === "transparent" ||
    value === "currentColor"
  );
}

export function resolveDictColor(
  specificColor: string | undefined,
  genericColor: string | undefined,
  token: object,
): string | undefined {
  const color = specificColor ?? genericColor;
  if (!color) return undefined;
  if (presetColors.includes(color) || isExplicitCssColor(color)) return color;

  const tokenValues = token as Record<string, unknown>;
  const tokenValue = tokenValues[color];
  if (typeof tokenValue === "string") return tokenValue;

  const aliasValue = tokenValues[semanticColorAliases[color]];
  return typeof aliasValue === "string" ? aliasValue : color;
}
