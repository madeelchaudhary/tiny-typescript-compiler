"use client";

import React, { useState } from "react";
import { compiler } from "@/compiler"; // Updated import statement
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CompilationResult from "./CompilationResult";

export default function Compiler() {
  const [input, setInput] =
    useState(`function add(a: number, b: number): number {
  return a + b;
}`);
  const [output, setOutput] = useState("");
  const [ast, setAst] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCompile = () => {
    try {
      const result = compiler(input);
      setOutput(result.output);
      setAst(JSON.stringify(result.ast, null, 2));
      setError(null);
    } catch (error) {
      setOutput("");
      setAst("");
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">
        Tiny TypeScript to JavaScript Compiler
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Input (TypeScript-like)</h2>
          <Textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            className="w-full h-60 font-mono"
            placeholder="Enter your TypeScript-like code here..."
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Output (JavaScript)</h2>
          <CompilationResult output={output} error={error} />
        </div>
      </div>
      <Button onClick={handleCompile} className="w-full">
        Compile
      </Button>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Abstract Syntax Tree (AST)</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 font-mono">
          {ast}
        </pre>
      </div>
    </div>
  );
}
