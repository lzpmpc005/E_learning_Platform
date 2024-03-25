import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad } from "@/redux/features/authSlice";
import { useVerifyMutation } from "@/redux/features/authApiSlice";

export default function useVerify() {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        dispatch(setAuth());
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, []);
}
