import type { ComponentProps, ComponentType } from "react";

import { AntdButton } from "./AntdButton";
import { LinkButton } from "./LinkButton";
import { TextButton } from "./TextButton";

type ButtonComponent = ComponentType<ComponentProps<typeof AntdButton>> & {
  Text: typeof TextButton;
  Link: typeof LinkButton;
};

export const Button = Object.assign(AntdButton, {
  Text: TextButton,
  Link: LinkButton,
}) as ButtonComponent;

export { AntdButton, LinkButton, TextButton };
export default Button;
