"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout as setLogout } from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { NavLink } from "@/components/common";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
        localStorage.removeItem("userId");
        window.location.reload();
      });
  };

  const isSelected = (path: string) => (pathname === path ? true : false);

  const authLinks = (isMobile: boolean) => (
    <>
      <div>
        <NavLink isSelected={isSelected("/")} isMobile={isMobile} href="/">
          Dashboard
        </NavLink>
      </div>
      <div>
        <NavLink isMobile={isMobile} onClick={handleLogout}>
          Logout
        </NavLink>
      </div>
    </>
  );

  const guestLinks = (isMobile: boolean) => (
    <>
      <NavLink
        isSelected={isSelected("/auth/login")}
        isMobile={isMobile}
        href="/auth/login"
      >
        Login
      </NavLink>
      <NavLink
        isSelected={isSelected("/auth/register")}
        isMobile={isMobile}
        href="/auth/register"
      >
        Register
      </NavLink>
    </>
  );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={
            !isAuthenticated ? () => router.push("/auth/login") : undefined
          }
        >
          {isAuthenticated ? "My Account" : "Login"}
        </DropdownMenuTrigger>
        {isAuthenticated && (
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {authLinks(false)}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
