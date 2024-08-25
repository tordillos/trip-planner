import { Stack } from "expo-router";

export default function OnBoardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
