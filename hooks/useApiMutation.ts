import { useState } from "react";
import { useMutation } from "convex/react";
import { type FunctionReference } from "convex/server";

export function useApiMutation<Payload, Result>(
  mutationFunction: FunctionReference<"mutation">
) {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = async (payload: Payload): Promise<Result> => {
    setPending(true);
    try {
      const result = await apiMutation(payload);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setPending(false);
    }
  };

  return {
    mutate,
    pending,
  };
}
