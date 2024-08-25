import { Redirect, Tabs } from "expo-router";

import { Sun } from "@/lib/icons/Sun";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(login)/login"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: () => <Sun />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: () => <Sun />,
        }}
      />
    </Tabs>
  );
}
