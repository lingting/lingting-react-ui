import { ProFormField } from "@ant-design/pro-components";

import { RegionSelect } from "../region";
import type { ExFormRegionProps } from "@lri/types";

export function ExFormRegion({
  className,
  filter,
  multipart = false,
  renderItem,
  ...props
}: ExFormRegionProps) {
  return (
    <ProFormField {...props}>
      <RegionSelect
        className={className}
        filter={filter}
        multipart={multipart}
        renderItem={renderItem}
      />
    </ProFormField>
  );
}
