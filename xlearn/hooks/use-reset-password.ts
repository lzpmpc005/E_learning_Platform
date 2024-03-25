import { useResetPasswordMutation } from "@/redux/features/authApiSlice";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [email, setEmail] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmail(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPassword(email)
      .unwrap()
      .then(() => {
        toast.success("Please check email for reset link!");
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
          toast.error(error.message || "Failed to send request!");
        }
      });
  };

  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  };
}
