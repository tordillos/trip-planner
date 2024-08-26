import type { ClerkError } from "@/types/types";
import type {
  StartOAuthFlowParams,
  StartOAuthFlowReturnType,
} from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const googleOAuth = async (
  startOAuthFlow: (
    startOAuthFlowParams?: StartOAuthFlowParams | undefined,
  ) => Promise<StartOAuthFlowReturnType>,
) => {
  try {
    const { createdSessionId, setActive } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/explore"),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err) {
    console.error(err);
    const error = (err as ClerkError) || "An error occurred";
    return {
      success: false,
      message: error?.errors[0]?.longMessage,
    };
  }
};
