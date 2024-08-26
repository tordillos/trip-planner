import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const { user } = useUser();
  const { signOut } = useAuth();

  const onLogout = () => {
    signOut();
  };

  return (
    <View style={{ marginTop: insets.top }}>
      <Text>Hello {user?.emailAddresses[0]?.emailAddress} 👋</Text>

      <Button onPress={onLogout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
