export const ServerComponentInner = () => {
  return <div>SERVER? {(typeof window === "undefined").toString()}</div>;
};
