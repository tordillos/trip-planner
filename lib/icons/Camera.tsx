import Svg, { Path, type SvgProps } from "react-native-svg";
import { iconWithClassName } from "./iconWithClassName";

function CameraIcon(props: SvgProps) {
  return (
    <Svg width={28} height={24} viewBox="0 0 28 24" fill="none" {...props}>
      <Path
        d="M10.887 2.667L8.22 5.333H3.116v16h21.333v-16h-5.104L16.68 2.667h-5.792zM9.783 0h8l2.666 2.667h5.334A1.333 1.333 0 0127.116 4v18.667A1.334 1.334 0 0125.783 24h-24a1.334 1.334 0 01-1.334-1.333V4a1.333 1.333 0 011.334-1.333h5.333L9.783 0zm4 20a7.333 7.333 0 110-14.666 7.333 7.333 0 010 14.666zm0-2.667a4.667 4.667 0 100-9.333 4.667 4.667 0 000 9.333z"
        fill="currentColor"
      />
    </Svg>
  );
}

iconWithClassName(CameraIcon);

export { CameraIcon };
