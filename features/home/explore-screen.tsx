import { Text } from "@/components/ui/text";
import { useUser } from "@clerk/clerk-expo";
import { View } from "react-native";

export function ExploreScreen() {
  const { user } = useUser();
  return (
    <View>
      <Text>Hello {user?.emailAddresses[0]?.emailAddress} 👋</Text>
    </View>
  );
}
