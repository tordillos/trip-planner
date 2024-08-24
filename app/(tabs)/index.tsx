import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left, }}>
      <View className="flex-1">
        <Image source={require('../../assets/images/home-screen.jpg')} style={{width: '100%', height: '100%'}} />
      </View>
      <View className="flex-1 justify-end pb-36 rounded-t-3xl bg-background -mt-6 gap-8">
        <Text className="text-5xl text-center">AI Trip Planner</Text>
        <Text className="self-center w-80 text-justify ">Get personalized travel recommendations based on your style and budget. Find the perfect destination in just a few taps!</Text>
        <Button className="self-center min-w-80" onPress={() => {}}><Text>Get Started</Text></Button>
      </View>
    </View>
  );
}