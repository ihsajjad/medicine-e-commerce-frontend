"use client";
import { useEffect, useState } from "react";

const VerificationPage = () => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [canRequestNewCode, setCanRequestNewCode] = useState(true);

  useEffect(() => {
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
  }, [canRequestNewCode]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(code);
  };

  const handleRequestNewCode = async () => {};

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
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary/80"
          >
            Verify
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleRequestNewCode}
            disabled={!canRequestNewCode}
            className="text-primary hover:underline disabled:text-gray-400"
          >
            {canRequestNewCode ? "Request New Code" : `Wait ${timer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
