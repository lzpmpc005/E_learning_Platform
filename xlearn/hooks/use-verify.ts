import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad } from "@/redux/features/authSlice";
import { useVerifyMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";

export default function useVerify() {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        dispatch(setAuth());
      })
      .catch(() => {
        localStorage.removeItem("userId");
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, []);
}
