import type { RegionFilter, RegionItem, RegionPhone } from "@lri/types";

import regionM49Data from "../components/region/m49.json";
import regionPhoneData from "../components/region/phones.json";
import regionData from "../components/region/regions.json";

export const regionItems = regionData as RegionItem[];

export const regionM49 = regionM49Data;

export const regionPhones = regionPhoneData as RegionPhone[];

export const regionPhoneMap = regionPhones.reduce<
  Record<string, { data: RegionPhone[]; calling: number[]; prefix: number[] }>
>((map, phone) => {
  const item = map[phone.region] ?? { data: [], calling: [], prefix: [] };
  item.data.push(phone);
  if (!item.calling.includes(phone.calling)) item.calling.push(phone.calling);
  if (!item.prefix.includes(phone.prefix)) item.prefix.push(phone.prefix);
  map[phone.region] = item;
  return map;
}, {});

export const regionItemMap = new Map(regionItems.map((item) => [item.iso, item]));

export function normalizeRegionValue(value?: string | null) {
  return value?.toUpperCase();
}

export function findRegionItem(value?: string | null) {
  const normalizedValue = normalizeRegionValue(value);
  return normalizedValue ? regionItemMap.get(normalizedValue) : undefined;
}

export const filterRegionItems: RegionFilter = (input, items) => {
  const trim = input?.trim();
  if (!trim?.length) return items;
  const upper = trim.toUpperCase();

  return items.filter((item) => {
    if (item.iso.includes(upper)) return true;
    if (item.callingCodes.some((v) => v.includes(trim))) return true;
    if (item.phonePrefixes.some((v) => v.includes(trim))) return true;
    if (item.names.en.includes(trim)) return true;
    if (item.names.zh.includes(trim)) return true;
    // noinspection RedundantIfStatementJS
    return false;
  });
};
