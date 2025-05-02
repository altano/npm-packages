export function is400(status: number): boolean {
  return status >= 400 && status < 500;
}
