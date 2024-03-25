import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/authApiSlice";
import { setAuth } from "@/redux/features/authSlice";
import { toast } from "react-toastify";

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email, password })
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        toast.success("Welcome to collegeX!");
        router.push("/");
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
          toast.error(error.message || "Something went wrong!");
        }
      });
  };

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  };
}
