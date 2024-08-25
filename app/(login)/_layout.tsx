import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function OnBoardingLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(root)/explore"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
