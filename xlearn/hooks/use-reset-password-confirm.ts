import { useResetPasswordConfirmMutation } from "@/redux/features/authApiSlice";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

export default function useResetPasswordConfirm(uid: string, token: string) {
  const router = useRouter();
  const [resetPasswordConfirm, { isLoading }] =
    useResetPasswordConfirmMutation();
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const { new_password, re_new_password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPasswordConfirm({ uid, token, new_password, re_new_password })
      .unwrap()
      .then(() => {
        toast.success("Password Reset Successful!");
        router.push("/auth/login");
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
        } else {
          toast.error(error.message || "Failed to reset password!");
        }
      });
  };

  return {
    new_password,
    re_new_password,
    isLoading,
    onChange,
    onSubmit,
  };
}
