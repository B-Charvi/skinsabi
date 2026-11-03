import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return <EmptyState title="404" action={<Link className="button button--cta" href="/">Back to home</Link>}>
    This page could not be found.
  </EmptyState>;
}
