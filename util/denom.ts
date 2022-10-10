export function humanizeAmount(amount: string | number, fixedPoint?: number) {
  return (parseInt(amount as string) / 1_000_000).toFixed(fixedPoint || 0)
}
