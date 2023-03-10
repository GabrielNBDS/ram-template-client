import React from "react";
import { useActionData, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
type JSONResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    message: string;
  };
};

type TransitionLogValue = "loading" | "idle";
type UseRemixSubmitOptions = {
  /**
   * @description
   * Called after a remix `loader`  or `action` has succesfully complete & if `success` property in the data is `true`
   */
  onSuccess?: (loaderData: any) => void;
  /**
   * @description
   * Called after a remix `loader` or `action` has succesfully completed  & if `success` property in the data is `false`
   */
  onError?: (loaderData: any) => void;
  /**
   * @description
   * Unique identifier of `submit` being made. This is intended to help
   * identify which API requests are made on pages where multiple API requests happen.
   *
   * @reference
   * This idea was inspired from the `queryKey` prop featured in react-query
   * React Query, Using query keys: https://tanstack.com/query/v4/docs/react/guides/query-keys
   */
  queryKey: string;
};

/**
 * @description
 * A superset of remix's `useSubmit` hook.
 * To determine if a `submit` call is successfull, this currently
 * expects our loaders to return a JSON object of this shape:  { status: 'success | "error"; data: .. };
 * The `status` keyword in the JSON response is used to determin if an API call was successful or not.
 *
 * @example
 * const {submit} = useRemixSubmit((onSuccess: () => {..}, onError: () => {...}))
 */
export const useRemixSubmit = ({ onError, onSuccess, queryKey }: UseRemixSubmitOptions) => {
  const submit = useSubmit();
  const [transitionLog, setTransitionLog] = React.useState<TransitionLogValue[]>(["idle"]); // start at 'idle'
  const transition = useTransition();
  const loaderData = useLoaderData() as JSONResponse<any>;
  const actionData = useActionData() as JSONResponse<any> & { key: string };
  const [transitionType, setTransitionType] = React.useState<"actionSubmission" | "loaderSubmission">();

  /**
   * @description
   * Monitor transition.state in order to determine when to fire `onSuccess`, `onError` callbacks
   *
   * 1.['idle']
   * 2.['idle'. 'loading'] --------------------------------------------> we are in a loading state
   * 3.['idle'. 'loading'] && transition.state === 'idle'  ------------> we've finished a submission
   */
  React.useEffect(() => {
    const hasFinishedSubmission = transitionLog.length === 2 && transition.state === "idle";
    const shouldAppendTransitionLog = transitionLog.length < 3 && transition.state === "loading";
    const shouldResetTransitionLog = transitionLog.length === 2 && transition.state === "idle";

    if (shouldAppendTransitionLog) {
      setTransitionLog([...transitionLog, "loading"]);
    }
    if (shouldResetTransitionLog) {
      setTransitionLog(["idle"]);
    }

    // Handle calling onSuccess onError callbacks
    if (onSuccess && (loaderData?.success || actionData?.success) && hasFinishedSubmission && actionData.key === queryKey) {
      const data = transitionType === "loaderSubmission" ? loaderData : actionData;
      onSuccess(data);
    }
    if (onError && (!loaderData?.success || !actionData?.success) && hasFinishedSubmission && actionData.key === queryKey) {
      const data = transitionType === "loaderSubmission" ? loaderData : actionData;
      onError(data);
    }
  }, [transition.state]);

  /**
   * @description
   * Keep track if the submission is a `loaderSubmission` or `actionSubmission`, this will help us determine whether we need to pass back
   * loader data or or action data to `onSuccess` or `onError`.
   *
   * @example:
   * We may be be making a POST request for example & remix could do an entire page revalidation/refetch
   * and also return back to use `loaderData`, when we really wanted to focus on the `actionData`.
   */
  React.useEffect(() => {
    if (transition.type === "actionSubmission") {
      setTransitionType("actionSubmission");
    } else if (transition.type === "loaderSubmission") {
      setTransitionType("loaderSubmission");
    }
  }, [transition.state]);

  return { submit, transition };
};
