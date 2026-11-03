import { ProductChecker } from "@/components/product-checker";
import { RequireLogin } from "@/components/require-login";

export default function Products() {
  return <RequireLogin what="use Products"><ProductChecker/></RequireLogin>;
}
