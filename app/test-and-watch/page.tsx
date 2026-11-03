import { CheckIn } from "@/components/check-in";
import { RequireLogin } from "@/components/require-login";

export default function TestWatch() {
  return <RequireLogin what="use Test & Watch"><CheckIn/></RequireLogin>;
}
