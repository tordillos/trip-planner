import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { googleOAuth } from "@/lib/auth";
import { useOAuth } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

export function AuthGoogle() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);

    if (result.code === "success" || result.code === "session_exists") {
      router.replace("/(root)/explore");
    } else {
      Alert.alert("Error", result.message);
    }
  };
  return (
    <Button variant="secondary" className="mt-4" onPress={handleGoogleSignIn}>
      <View className="flex-row gap-4 align-middle">
        <Image
          source={require("../../assets/images/google.png")}
          style={{ width: 20, height: 20 }}
        />
        <Text>Log in with Google</Text>
      </View>
    </Button>
  );
}
