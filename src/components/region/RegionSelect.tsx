import { Select, Space } from "antd";
import { memo, useMemo } from "react";

import { filterRegionItems, normalizeRegionValue, regionItems } from "@lri/lib";
import type { RegionItem, RegionSelectMultipleProps, RegionSelectProps } from "@lri/types";

import { RegionFlag } from "./RegionFlag";

type RegionSelectComponentProps = RegionSelectProps | RegionSelectMultipleProps;

function renderDefaultRegionItem(item: RegionItem) {
  const phonePrefix = item.phonePrefixes[0];
  return (
    <Space size="small">
      <RegionFlag value={item.iso} />
      <span>
        {phonePrefix ? `+${phonePrefix} ` : ""}
        {item.names.zh}
      </span>
    </Space>
  );
}

function RegionSelectComponent({
  className,
  style,
  filter = filterRegionItems,
  multipart = false,
  onChange,
  renderItem = renderDefaultRegionItem,
  value,
}: RegionSelectComponentProps) {
  const options = useMemo(
    () => regionItems.map((item) => ({ label: renderItem(item), value: item.iso })),
    [renderItem],
  );
  const normalizedValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map(normalizeRegionValue).filter((item): item is string => Boolean(item));
    }
    return normalizeRegionValue(value);
  }, [value]);

  return (
    <Select
      allowClear={true}
      className={className}
      style={{ width: "100%", ...style }}
      mode={multipart ? "multiple" : undefined}
      onChange={(nextValue) => {
        if (multipart) {
          const multipleOnChange = onChange as RegionSelectMultipleProps["onChange"];
          multipleOnChange?.((nextValue as string[]).map((item) => item.toUpperCase()));
          return;
        }

        const singleOnChange = onChange as RegionSelectProps["onChange"];
        singleOnChange?.(normalizeRegionValue(nextValue as string | undefined));
      }}
      options={options}
      showSearch={{
        filterOption: (input, option) =>
          filter(input, regionItems).some((item) => item.iso === option?.value),
      }}
      value={normalizedValue}
    />
  );
}

export const RegionSelect = memo(RegionSelectComponent);
