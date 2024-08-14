"use client";
import apiClient from "@/components/apiClient";
import { errorToast, successToast } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const sendCode = searchParams.get("sendCode");
  const shouldRequest =
    (sendCode === "false" && true) || (sendCode === "true" && false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [canRequestNewCode, setCanRequestNewCode] =
    useState<boolean>(shouldRequest);

  const router = useRouter();

  const data = useAppSelector((state) => state.auth);

  useEffect(() => {
    //   redirecting the user if email is verified
    if (data.user?.emailVerified) {
      router.push("/dashboard");
    }

    if (!canRequestNewCode) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanRequestNewCode(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canRequestNewCode, data.user?.emailVerified, router]);

  // Function to verify code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await apiClient.post(`/api/users/verify-email?code=${code}`);
      setIsLoading(false);

      successToast(res.data.message);
      router.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleRequestNewCode = async () => {
    try {
      await apiClient.get("/api/users/verification-code");
      setCanRequestNewCode(false);
    } catch (error: any) {
      errorToast(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter your code"
              required
            />
          </div>
          <button
            type="submit"
            disabled={code.length !== 4}
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary/80"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters
                size={24}
                className="animate-spin mx-auto my-0.5"
              />
            ) : (
              "Verify"
            )}
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleRequestNewCode}
            disabled={!canRequestNewCode}
            className="text-primary hover:underline disabled:text-gray-500"
          >
            {canRequestNewCode
              ? "Request New Code"
              : `Wait ${timer}s for new code.`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
