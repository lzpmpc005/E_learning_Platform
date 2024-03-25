"use client";

import { useEffect } from "react";
import { useActivationMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    uid: string;
    token: string;
  };
}

export default function Page({ params }: Props) {
  const [activation] = useActivationMutation();
  const router = useRouter();

  useEffect(() => {
    const { uid, token } = params;
    activation({ uid, token })
      .unwrap()
      .then(() => {
        toast.success("Account activated successfully");
      })
      .catch((error) => {
        if (typeof error.data === "object" && error.data !== null) {
          for (const key in error.data) {
            if (Array.isArray(error.data[key])) {
              error.data[key].forEach((errorMessage: string) => {
                toast.error(errorMessage);
              });
            } else {
              toast.error(error.data[key]);
            }
          }
        }
      })
      .finally(() => {
        router.push("/auth/login");
      });
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-grey-900">
          Activating your account...
        </h1>
      </div>
    </div>
  );
}
