export function disableArrowKeyScrolling(event: KeyboardEvent) {
  if (
    ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
      event.code
    ) > -1
  ) {
    event.preventDefault();
  }
}
