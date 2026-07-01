"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackPage() {

  const router = useRouter();

  useEffect(() => {

    async function loadUser() {

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }

    }

    loadUser();

  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}