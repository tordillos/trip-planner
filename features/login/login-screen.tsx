import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function LoginScreen() {
  const insets = useSafeAreaInsets();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    Alert.alert("Login", JSON.stringify(data));
  };
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
      <Form {...form}>
        <View className="gap-4 flex-1 justify-center mx-4 h-screen">
          <Text className="text-2xl">Welcome 👋</Text>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormInput
                label="Email"
                placeholder="hello@zachnugent.ca"
                autoCapitalize="none"
                autoComplete="email"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormInput
                label="Password"
                placeholder="******"
                autoCapitalize="none"
                autoComplete="password"
                {...field}
              />
            )}
          />
          <Button className="mt-4" onPress={form.handleSubmit(onSubmit)}>
            <Text>Sign In</Text>
          </Button>
          <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
            <View className="flex-1 h-[1px] bg-primary/30" />
            <Text className="text-lg text-primary">Or</Text>
            <View className="flex-1 h-[1px] bg-primary/30" />
          </View>
          <Button variant="secondary" className="mt-4">
            <View className="flex-row gap-4 align-middle">
              <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text>Log In with Google</Text>
            </View>
          </Button>
        </View>
      </Form>
    </ScrollView>
  );
}
