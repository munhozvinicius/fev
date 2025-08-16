
import AppFunil from "@/components/AppFunil";
import { SessionProvider } from "next-auth/react";

export default function Page(){
  return (
    <SessionProvider>
      <AppFunil />
    </SessionProvider>
  );
}
