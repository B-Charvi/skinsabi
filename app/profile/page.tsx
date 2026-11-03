import { ProfileForm } from "@/components/profile-form";
import { RequireLogin } from "@/components/require-login";

export default function ProfilePage() {
  return <RequireLogin what="see your profile"><ProfileForm/></RequireLogin>;
}
