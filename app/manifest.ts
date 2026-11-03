import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SkinSabi",
    short_name: "SkinSabi",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#0F3D2E",
  };
}
