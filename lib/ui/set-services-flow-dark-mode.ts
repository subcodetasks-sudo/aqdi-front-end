/** Apply/clear scoped dark mode for services create flows (property/contract/units). */
export function setServicesFlowDarkMode(options: {
  enabled: boolean;
  shellClass:
    | "services-dark-shell"
    | "create-property-dark-shell"
    | "create-contract-dark-shell"
    | "create-flow-dark-shell";
}) {
  const shell = document.querySelector<HTMLElement>("[data-services-layout]");
  const root = document.documentElement;

  if (options.enabled) {
    shell?.classList.add("dark", options.shellClass);
    root.classList.add("dark");
    root.dataset.aqdiDarkShell = options.shellClass;
    return;
  }

  shell?.classList.remove("dark", options.shellClass);

  if (root.dataset.aqdiDarkShell === options.shellClass) {
    delete root.dataset.aqdiDarkShell;
  }

  const stillDark =
    Boolean(shell?.classList.contains("dark")) ||
    Boolean(root.dataset.aqdiDarkShell);

  if (!stillDark) {
    root.classList.remove("dark");
  }
}
