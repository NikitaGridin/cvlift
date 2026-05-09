export function hasRealEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    return false;
  }

  return !(
    value.startsWith("your-") ||
    value.startsWith("replace-") ||
    value.includes("replace-with") ||
    value.includes("your-domain") ||
    value.includes("your-subdomain")
  );
}
