import { useMemo } from "react";

import {
  findDictItemByData,
  normalizeDictData,
  toDictOptions,
  type NormalizedDictItem,
} from "@lri/lib";
import type { DictData, DictValue } from "@lri/types";

export function useDictItems<T extends DictValue>(dictdata: DictData<T>): NormalizedDictItem<T>[] {
  return useMemo(() => normalizeDictData(dictdata), [dictdata]);
}

export function useDictOptions<T extends DictValue>(dictdata: DictData<T>) {
  return useMemo(() => toDictOptions(dictdata), [dictdata]);
}

export function useDictValue<T extends DictValue>(
  dictdata: DictData<T>,
  value: T | null | undefined,
) {
  const items = useDictItems(dictdata);

  return useMemo(
    () => ({
      items,
      item: findDictItemByData(items, value),
    }),
    [items, value],
  );
}
