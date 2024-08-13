import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";

const NavBar = () => {
  const isLoggedIn = false;

  const options = (
    <>
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <button className="border px-2 py-1 rounded-full text-sm border-primary text-primary">
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
