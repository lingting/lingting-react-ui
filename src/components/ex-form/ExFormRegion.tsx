import { ProFormField } from "@ant-design/pro-components";
import clsx from "clsx";

import { RegionSelect } from "../region";
import type { ExFormRegionProps } from "@lri/types";

import "./ExForm.css";

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
        className={clsx("ex-form-control", className)}
        filter={filter}
        multiple={multiple}
        renderItem={renderItem}
      />
    </ProFormField>
  );
}
