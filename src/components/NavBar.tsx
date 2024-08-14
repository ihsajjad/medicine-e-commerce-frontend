"use client";

import { successToast } from "@/lib/utils";
import { signOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Update client-side state based on user data
    if (data.user) {
      setIsLoggedIn(!!data.user.email);
    }
  }, [data.user]);

  const logOut = async () => {
    const result = await dispatch(signOut());
    successToast("Sign out successful");
  };

  const options = (
    <>
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <button
              onClick={logOut}
              className="border px-2 py-1 rounded-full text-sm border-primary text-primary"
            >
              Sign Out
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href={"/sign-in"}>Sign In</Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="h-14 w-full bg-white shadow-xl shadow-[#00000010] sticky top-0 flex-center">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <Link href={"/"} className="text-2xl font-semibold text-primary">
            CareCube
          </Link>
          <menu className="flex items-center gap-4">{options}</menu>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;
