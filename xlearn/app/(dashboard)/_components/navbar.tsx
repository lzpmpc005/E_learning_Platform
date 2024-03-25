// "use client";

// import { Disclosure } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { useRouter, usePathname } from "next/navigation";
// import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// import { logout as setLogout } from "@/redux/features/authSlice";
// import { useLogoutMutation } from "@/redux/features/authApiSlice";
// import { NavLink } from "@/components/common";

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useAppDispatch();
//   const { isAuthenticated } = useAppSelector((state) => state.auth);
//   const [logout] = useLogoutMutation();

//   const handleLogout = () => {
//     logout(undefined)
//       .unwrap()
//       .then(() => {
//         dispatch(setLogout());
//       })
//       .finally(() => {
//         router.push("/");
//       });
//   };

//   const isSelected = (path: string) => (pathname === path ? true : false);

//   const authLinks = (isMobile: boolean) => (
//     <>
//       <NavLink isSelected={isSelected("/")} isMobile={isMobile} href="/">
//         Dashboard
//       </NavLink>
//       <NavLink isMobile={isMobile} onClick={handleLogout}>
//         Logout
//       </NavLink>
//     </>
//   );

//   const guestLinks = (isMobile: boolean) => (
//     <>
//       <NavLink
//         isSelected={isSelected("/auth/login")}
//         isMobile={isMobile}
//         href="/auth/login"
//       >
//         Login
//       </NavLink>
//       <NavLink
//         isSelected={isSelected("/auth/register")}
//         isMobile={isMobile}
//         href="/auth/register"
//       >
//         Register
//       </NavLink>
//     </>
//   );

//   return (
//     <Disclosure as="nav" className="bg-gray-800">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
//             <div className="relative flex h-16 items-center justify-between">
//               <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
//                 <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
//                   <span className="absolute -inset-0.5" />
//                   <span className="sr-only">Open main menu</span>
//                   {open ? (
//                     <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                   )}
//                 </Disclosure.Button>
//               </div>
//               <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
//                 <div className="flex flex-shrink-0 items-center">
//                   <NavLink href="/" isBanner>
//                     collegeX
//                   </NavLink>
//                 </div>
//                 <div className="hidden sm:ml-6 sm:block">
//                   <div className="flex space-x-4">
//                     {isAuthenticated ? authLinks(false) : guestLinks(false)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Disclosure.Panel className="sm:hidden">
//             <div className="space-y-1 px-2 pb-3 pt-2">
//               {isAuthenticated ? authLinks(true) : guestLinks(true)}
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }
export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm"></div>
  );
};
