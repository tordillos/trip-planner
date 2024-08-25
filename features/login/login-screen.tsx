import { Text } from "@/components/ui/text";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function LoginScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
      }}
      className="flex-1"
    >
      <Text className="text-3xl text-center">Login</Text>
    </ScrollView>
  );
}
