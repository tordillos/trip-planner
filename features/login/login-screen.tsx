import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import type { ClerkError } from "@/types/types";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { AuthGoogle } from "./auth-google";

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

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err) {
      const error = (err as ClerkError) || "An error occurred";
      Alert.alert("Error", error.errors[0].longMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    secureTextEntry={true}
                    {...field}
                  />
                )}
              />
              <Link href="/(login)/change-password" asChild>
                <Text className="text-right text-primary">
                  Forgot Password?
                </Text>
              </Link>
              <Button className="mt-4" onPress={form.handleSubmit(onSubmit)}>
                <Text>Sign In</Text>
              </Button>
              <View className="flex flex-row justify-center items-center mt-4 gap-3">
                <View className="flex-1 h-[1px] bg-primary/30" />
                <Text className="text-lg text-primary">Or</Text>
                <View className="flex-1 h-[1px] bg-primary/30" />
              </View>
              <AuthGoogle />
              <Link href="/(login)/sign-up" asChild>
                <Text className="text-center mt-4 text-primary/60">
                  You don't have an account?{" "}
                  <Text className="text-primary">Register</Text>
                </Text>
              </Link>
            </View>
          </Form>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
