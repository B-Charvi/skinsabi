import { RequireLogin } from "@/components/require-login";
import { RoutineBuilder } from "@/components/routine-builder";

export default function Routine() {
  return <RequireLogin what="use your Routine"><RoutineBuilder/></RequireLogin>;
}
