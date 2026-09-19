import clsx from "clsx";
import type { MouseEvent } from "react";

import "./WindowResizeBorder.css";

export type WindowResizeDirection =
  | "north"
  | "south"
  | "west"
  | "east"
  | "northWest"
  | "northEast"
  | "southWest"
  | "southEast";

type ResizeBorderItem = {
  className: string;
  direction: WindowResizeDirection;
};

const resizeBorderItems: ResizeBorderItem[] = [
  {
    className: "window-resize-border__item--north",
    direction: "north",
  },
  {
    className: "window-resize-border__item--south",
    direction: "south",
  },
  {
    className: "window-resize-border__item--west",
    direction: "west",
  },
  {
    className: "window-resize-border__item--east",
    direction: "east",
  },
  {
    className: "window-resize-border__item--north-west",
    direction: "northWest",
  },
  {
    className: "window-resize-border__item--north-east",
    direction: "northEast",
  },
  {
    className: "window-resize-border__item--south-west",
    direction: "southWest",
  },
  {
    className: "window-resize-border__item--south-east",
    direction: "southEast",
  },
];

export type WindowResizeBorderProps = {
  onStartResize: (direction: WindowResizeDirection) => void;
};

export function WindowResizeBorder({ onStartResize }: WindowResizeBorderProps) {
  const handleMouseDown =
    (direction: WindowResizeDirection) => (event: MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      onStartResize(direction);
    };

  return (
    <div aria-hidden="true" className="window-resize-border">
      {resizeBorderItems.map((item) => (
        <div
          key={item.direction}
          className={clsx("window-resize-border__item", item.className)}
          onMouseDown={handleMouseDown(item.direction)}
        />
      ))}
    </div>
  );
}
