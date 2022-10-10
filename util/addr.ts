export function truncate(address: string) {
  return `${address.substring(0, 12)}...${address.substring(
    address.length - 8,
    address.length,
  )}`
}
