export function closestDivisibleInteger(
  center: number,
  divider: number
): number {
  const lessOrEqualCenter = center - (center % divider);
  const greaterThanCenter = center + divider - (center % divider);
  // let's check which is closer
  if (center - lessOrEqualCenter > greaterThanCenter - center) {
    return greaterThanCenter;
  } else {
    return lessOrEqualCenter;
  }
}
