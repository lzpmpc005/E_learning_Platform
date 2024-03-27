import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";
import { toast } from "react-toastify";

export default function useSocialAuth(authenticate: any, provider: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const SearchParams = useSearchParams();

  const effectRan = useRef(false);

  useEffect(() => {
    const state = SearchParams.get("state");
    const code = SearchParams.get("code");

    if (code && state && !effectRan.current) {
      authenticate({ provider, code, state })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          toast.success("Logged in successfully");
          router.push("/");
        })
        .catch(() => {
          toast.error("Failed to login");
          router.push("/auth/login");
        });
    }

    return () => {
      effectRan.current = true;
    };
  }, [authenticate, provider]);
}
