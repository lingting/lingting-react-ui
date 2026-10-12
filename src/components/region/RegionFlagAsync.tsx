import Icon, { LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { createSvgIconComponent, findRegionItem } from "@lri/lib";
import type { RegionFlagAsyncProps } from "@lri/types";

import "./RegionFlag.css";

const LOAD_FAILED_TITLE = "图标加载失败";

const flagLoaders = import.meta.glob<string>("./flags/*.svg", {
  query: "?raw",
  import: "default",
});

const flagSvgCache = new Map<string, string | Promise<string>>();

/** 按路径动态载入国旗 SVG 源码，结果与进行中的请求都按路径缓存 */
function loadFlagSvg(path: string) {
  const cached = flagSvgCache.get(path);
  if (cached) return Promise.resolve(cached);

  const loader = flagLoaders[path];
  if (!loader) return Promise.reject(new Error(`未找到国旗资源：${path}`));

  const pending = loader().then(
    (source) => {
      flagSvgCache.set(path, source);
      return source;
    },
    (error: unknown) => {
      flagSvgCache.delete(path);
      throw error;
    },
  );
  flagSvgCache.set(path, pending);
  return pending;
}

function readFlagSvg(path?: string) {
  const cached = path ? flagSvgCache.get(path) : undefined;
  return typeof cached === "string" ? cached : undefined;
}

function RegionFlagAsyncComponent({
  className,
  onError,
  type = "svg",
  value,
}: RegionFlagAsyncProps) {
  const item = findRegionItem(value);
  const path = item ? `./flags/${item.flag}.svg` : undefined;
  const flagClassName = `region-flag ${className ?? ""}`;
  const [svgSource, setSvgSource] = useState(() => readFlagSvg(path));
  const [failed, setFailed] = useState(false);
  const onErrorRef = useRef(onError);

  onErrorRef.current = onError;

  useEffect(() => {
    const cached = readFlagSvg(path);
    setFailed(false);

    if (cached !== undefined) {
      setSvgSource(cached);
      return;
    }

    setSvgSource(undefined);
    if (!path) return;

    let active = true;
    void loadFlagSvg(path).then(
      (source) => {
        if (active) setSvgSource(source);
      },
      (error: unknown) => {
        if (!active) return;
        setFailed(true);
        onErrorRef.current?.(error);
      },
    );
    return () => {
      active = false;
    };
  }, [path]);

  const FlagSvg = useMemo(
    () => (svgSource ? createSvgIconComponent(svgSource) : null),
    [svgSource],
  );

  if (!path) return null;

  if (failed) {
    return (
      <Tooltip title={LOAD_FAILED_TITLE}>
        <WarningOutlined className={`${flagClassName} region-flag-error`} />
      </Tooltip>
    );
  }

  if (!FlagSvg) return <LoadingOutlined className={flagClassName} />;

  if (type === "icon") {
    return <Icon className={flagClassName} component={FlagSvg} />;
  }

  return <FlagSvg aria-hidden="true" className={flagClassName} />;
}

export const RegionFlagAsync = memo(RegionFlagAsyncComponent);
