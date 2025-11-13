"use client";

import { useState } from "react";
import { testPaddleConfiguration } from "@/lib/paddle";

export default function TestPaddlePage() {
  const [result, setResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    const testResult = await testPaddleConfiguration();
    setResult(testResult);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Paddle Configuration Test</h1>
        
        <button
          onClick={runTest}
          disabled={testing}
          className="bg-[#8952e0] hover:bg-[#7543c9] px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test Paddle Configuration"}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-[#1a1a1a] border border-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              {result.success ? "✅ Success" : "❌ Failed"}
            </h2>
            <p className="mb-4">{result.message}</p>
            
            <div className="bg-[#0a0a0a] p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-[#1a1a1a] border border-gray-700 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Environment Variables Check</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Sandbox Token:</strong>{" "}
              {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX
                ? `${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX.substring(0, 15)}... (${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX.length} chars)`
                : "❌ Missing"}
            </div>
            <div>
              <strong>Production Token:</strong>{" "}
              {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
                ? `${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.substring(0, 15)}... (${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.length} chars)`
                : "❌ Missing"}
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-[#1a1a1a] border border-gray-700 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Test Paddle Configuration" button above</li>
            <li>Check browser console (F12) for detailed logs</li>
            <li>If test fails, verify your tokens in .env.local</li>
            <li>Tokens should be 40-50 characters long</li>
            <li>Restart dev server after updating .env.local</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
