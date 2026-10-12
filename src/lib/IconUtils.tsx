import type { SVGProps } from "react";

/** 将 SVG 源码解析为可直接渲染的图标组件，未声明 viewBox 时使用 640x480 兜底 */
export function createSvgIconComponent(source: string) {
  const [, viewBox = "0 0 640 480", content = ""] =
    source.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/) ?? [];

  return function SvgIcon(props: SVGProps<SVGSVGElement>) {
    return <svg {...props} dangerouslySetInnerHTML={{ __html: content }} viewBox={viewBox} />;
  };
}
