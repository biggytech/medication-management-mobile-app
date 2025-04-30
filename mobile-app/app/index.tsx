import { useAuthSession } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { Loader } from "@/components/Loader";

export default function RootLayout(): ReactNode {
  const { getToken, isLoading } = useAuthSession();

  if (isLoading) {
    return <Loader />;
  }

  if (!getToken()) {
    return <Redirect href={"/login"} />;
  }

  return <Redirect href={"/home"} />;
}
