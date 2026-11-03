"use client";

import { EmptyState } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <EmptyState title="Something went wrong" action={<button className="button button--cta" type="button" onClick={reset}>Try again</button>}>
    Please try again.
  </EmptyState>;
}
