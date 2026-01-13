export function getArg(index, fallback = "") {
  const v = process.argv[index];
  return v ?? fallback;
}
