export function getWebPPath(path: string) {
  return path.replace(/\..{3,4}$/, ".webp");
}
