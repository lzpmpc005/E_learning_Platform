"use client";

import { useSocialAuthMutation } from "@/redux/features/authApiSlice";
import { useSocialAuth } from "@/hooks";
import { Spinner } from "@/components/common";

export default function Page() {
  const [githubAuth] = useSocialAuthMutation();
  useSocialAuth(githubAuth, "github");
  return (
    <div className="my-8">
      <Spinner lg />
    </div>
  );
}
