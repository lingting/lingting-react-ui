import dayjs from "dayjs";

export function formatTimestamp(value: unknown, unit: "seconds" | "milliseconds") {
  const timestamp = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(timestamp)) return value;

  return dayjs(unit === "seconds" ? timestamp * 1000 : timestamp).format("YYYY-MM-DD HH:mm:ss");
}
