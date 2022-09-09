/**
 * Helper to abstract if app is running on Staging (galago-labs) env.
 *
 * We set the `VITE_RUNNING_IN_STAGING` Vite env var (see `.env` file) based
 * on which env we are running in. It would be possible to also do the vite
 * build in a different `mode`, but that messes up it outputting a production
 * code build, which we still want to have on Staging. This is really just
 * so we can display a banner warning the user that Staging is less stable
 * and they might rather be on Prod.
 *
 * We consider case-insensitive value of "true" for VITE_RUNNING_IN_STAGING
 * to be on, everything else is considered false.
 */
export function isAppRunningInStaging(): boolean {
  const RAW_ENV_VAR = import.meta.env.VITE_RUNNING_IN_STAGING as
    | string
    | undefined;
  const isStagingString = RAW_ENV_VAR || "";
  return isStagingString.toLowerCase() === "true";
}
