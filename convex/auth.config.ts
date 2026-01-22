import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://aware-pipefish-74.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;