import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import type { SvgProps } from "react-native-svg";

export type Icon = (props: SvgProps) => React.JSX.Element;

export function iconWithClassName(icon: Icon | LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}
