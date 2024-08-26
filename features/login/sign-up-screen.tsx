import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import type { ClerkError } from "@/types/types";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
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
import { ReactNativeModal } from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { AuthGoogle } from "./auth-google";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a valid name.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const formCodeSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Please enter a valid code.",
    })
    .max(6, { message: "Please enter a valid code." }),
});

export function SignUpScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [verification, setVerification] = React.useState({
    state: "default",
    error: "",
    code: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const formCode = useForm<z.infer<typeof formCodeSchema>>({
    resolver: zodResolver(formCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }
    formCode.reset();
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...verification, state: "pending", error: "" });
    } catch (err) {
      const error = (err as ClerkError) || "An error occurred";
      Alert.alert("Error", error.errors[0].longMessage);
    }
  };

  const onVerify = async (data: z.infer<typeof formCodeSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(root)/explore");
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "pending",
        });
      }
    } catch (_err) {
      setVerification({
        ...verification,
        error: "Verification failed. Please try again.",
        state: "pending",
      });
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
              <Text className="text-2xl">Create your account 🤙</Text>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormInput
                    label="Name"
                    placeholder="Alex Doe"
                    autoCapitalize="none"
                    autoComplete="name"
                    {...field}
                  />
                )}
              />
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
                    placeholder="**********"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    {...field}
                  />
                )}
              />
              <Button className="mt-4" onPress={form.handleSubmit(onSubmit)}>
                <Text>Sign Up</Text>
              </Button>
              <View className="flex flex-row justify-center items-center mt-4 gap-3">
                <View className="flex-1 h-[1px] bg-primary/30" />
                <Text className="text-lg text-primary">Or</Text>
                <View className="flex-1 h-[1px] bg-primary/30" />
              </View>
              <AuthGoogle />
              <Link href="/(login)/login" asChild>
                <Text className="text-center mt-4 text-primary/60">
                  Already have an account?{" "}
                  <Text className="text-primary">Login</Text>
                </Text>
              </Link>
            </View>
          </Form>
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            avoidKeyboard={true}
            onBackdropPress={() => {
              formCode.reset();
              form.reset();
              setVerification({ ...verification, state: "default" });
            }}
            onModalHide={() => {
              if (verification.state === "success") {
                router.replace("/(root)/explore");
              }
            }}
          >
            <View className="bg-background px-7 py-9 rounded-2xl min-h-72">
              <Text className="text-2xl mb-2">Verification</Text>
              <Text className="mb-5">
                We've sent a verification code to {form.getValues("email")}.
              </Text>
              <Form {...formCode}>
                <View className="gap-8">
                  <FormField
                    control={formCode.control}
                    name="code"
                    render={({ field }) => (
                      <FormInput autoCapitalize="none" {...field} />
                    )}
                  />
                  {verification.error.length > 0 && (
                    <Text className="text-destructive">
                      {verification.error}
                    </Text>
                  )}
                  <Button onPress={formCode.handleSubmit(onVerify)}>
                    <Text>Verify Email</Text>
                  </Button>
                </View>
              </Form>
            </View>
          </ReactNativeModal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
