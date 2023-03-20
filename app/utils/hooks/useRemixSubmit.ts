import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

type UseRemixSubmitOptions = {
  onSuccess?: (loaderData: any) => void;
  onError?: (loaderData: any) => void;
  queryKey?: string;
};

export const useRemixSubmit = ({ onError, onSuccess, queryKey }: UseRemixSubmitOptions) => {
  const fetcher = useFetcher()
  const loading = fetcher.state === 'loading' || fetcher.state === 'submitting'
  
  useEffect(() => {
    if (onSuccess && fetcher?.data?.success && fetcher.type === 'done' && fetcher?.data?.key === queryKey) {
      onSuccess(fetcher.data);
    }
    if (onError && !fetcher?.data?.success && fetcher.type === 'done' && fetcher?.data?.key === queryKey) {
      onError(fetcher.data);
    }
  }, [fetcher]);

  return { fetcher, loading };
};
