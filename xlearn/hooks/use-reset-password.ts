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
        let errorMessage = "";
        if (error.data) {
          for (const [key, value] of Object.entries(error.data)) {
            errorMessage += `${key}: ${(value as string[]).join(" ")} `;
          }
        }
        toast.error(errorMessage || "Failed to reset password!");
      });
  };

  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  };
}
