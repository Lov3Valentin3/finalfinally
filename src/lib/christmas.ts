export function getChristmasTarget(from = new Date()) {
  const year = from.getFullYear();
  let target = new Date(year, 11, 25, 0, 0, 0, 0);
  if (from.getTime() > target.getTime()) {
    target = new Date(year + 1, 11, 25, 0, 0, 0, 0);
  }
  return target;
}
export function getCountdownParts(from = new Date()) {
  const target = getChristmasTarget(from);
  const diff = Math.max(0, target.getTime() - from.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, target };
}
export function quoteOfDay<T extends { id: number }>(items: T[], date = new Date()) {
  if (!items.length) return null;
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return items[day % items.length];
}
