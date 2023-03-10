import type { Transition } from "@remix-run/react/dist/transition";

export default function useTransitionLoading(transition: Transition) {
  return transition.state === 'loading' || transition.state === 'submitting'
}