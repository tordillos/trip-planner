import { Tabs } from 'expo-router';
import React from 'react';


import { useColorScheme } from '@/hooks/useColorScheme';
import { Sun } from '@/lib/icons/Sun';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:  '#007AFF',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Sun />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Sun />
          ),
        }}
      />
    </Tabs>
  );
}
