export const componentElementRegistry = new Map<string, HTMLElement>();

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.componentElementRegistry) {
    module.exports =
      // @ts-expect-error
      global.componentElementRegistry;
  } else {
    // @ts-expect-error
    global.componentElementRegistry = exports;
  }
}
