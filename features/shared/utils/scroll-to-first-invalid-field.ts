const INVALID_FIELD_SELECTOR = '[aria-invalid="true"], [data-field-invalid="true"]';
const FOCUSABLE_SELECTOR = "input, select, textarea, button, [tabindex]";

export function scrollToFirstInvalidField() {
  if (typeof document === "undefined") {
    return;
  }

  const field = document.querySelector<HTMLElement>(INVALID_FIELD_SELECTOR);

  if (!field) {
    return;
  }

  field.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusTarget = field.matches(FOCUSABLE_SELECTOR)
    ? field
    : field.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);

  focusTarget?.focus({ preventScroll: true });
}
