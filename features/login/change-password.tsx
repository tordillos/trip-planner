import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import type { ClerkError } from "@/types/types";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const formCodeSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Please enter a valid code.",
    })
    .max(6, { message: "Please enter a valid code." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();

  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const [verification, setVerification] = React.useState({
    state: "default",
    error: "",
    code: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const formCode = useForm<z.infer<typeof formCodeSchema>>({
    resolver: zodResolver(formCodeSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      if (result.status === "needs_first_factor") {
        setVerification({ ...verification, state: "pending", error: "" });
      }
      // else {
      //   Alert.alert("Error", "Log in failed. Please try again.");
      // }
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
      const completeSignUp = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      console.log(completeSignUp);
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(root)/explore");
      } else {
        setVerification({
          ...verification,
          error: "Change password failed. Please try again.",
          state: "pending",
        });
      }
    } catch (err) {
      console.log(err);
      setVerification({
        ...verification,
        error: "Change password failed. Please try again.",
        state: "pending",
      });
    }
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
          <Text className="text-2xl">Reset your password 🔐</Text>
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
          <Button className="mt-4" onPress={form.handleSubmit(onSubmit)}>
            <Text>Send mail</Text>
          </Button>
          <Link href="/(login)/login" asChild>
            <Text className="text-center mt-4 text-primary/60">
              You remember the password?{" "}
              <Text className="text-primary">Login</Text>
            </Text>
          </Link>
        </View>
      </Form>
      <ReactNativeModal
        isVisible={verification.state === "pending"}
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
                  <FormInput label="Code" autoCapitalize="none" {...field} />
                )}
              />
              <FormField
                control={formCode.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="New Password"
                    placeholder="**********"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    {...field}
                  />
                )}
              />
              {verification.error.length > 0 && (
                <Text className="text-destructive">{verification.error}</Text>
              )}
              <Button onPress={formCode.handleSubmit(onVerify)}>
                <Text>Change Password</Text>
              </Button>
            </View>
          </Form>
        </View>
      </ReactNativeModal>
    </ScrollView>
  );
}
