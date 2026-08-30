import { ProFormField } from "@ant-design/pro-components";

import { RegionSelect } from "../region";
import type { ExFormRegionProps } from "@lri/types";

export function ExFormRegion({
  className,
  filter,
  multiple = false,
  renderItem,
  ...props
}: ExFormRegionProps) {
  return (
    <ProFormField {...props}>
      <RegionSelect
        className={className}
        filter={filter}
        multiple={multiple}
        renderItem={renderItem}
      />
    </ProFormField>
  );
}
