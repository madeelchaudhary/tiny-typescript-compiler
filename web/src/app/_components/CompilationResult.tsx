import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

interface CompilationResultProps {
  output: string;
  error: string | null;
}

export default function CompilationResult({
  output,
  error,
}: CompilationResultProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <CrossCircledIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <CheckCircledIcon className="h-4 w-4" />
      <AlertTitle>Compilation Successful</AlertTitle>
      <AlertDescription>
        <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
          {output}
        </pre>
      </AlertDescription>
    </Alert>
  );
}
