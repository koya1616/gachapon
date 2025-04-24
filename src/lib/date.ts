export function formatDate(timestamp: string | number): string {
  return new Date(Number(timestamp)).toLocaleString("ja-JP");
}
