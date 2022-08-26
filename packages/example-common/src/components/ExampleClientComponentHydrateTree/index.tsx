// TODO: This should hydrate the whole tree (at least once interacted with) so it doesn't remount into the DOM and disrupt video state.
export const ExampleClientComponentHydrateTree = () => (
  <>
    <h4>ExampleClientComponentHydrateTree</h4>

    <iframe
      width="112"
      height="63"
      src="https://www.youtube.com/embed/FZ0cG47msEk"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </>
);

ExampleClientComponentHydrateTree.displayName =
  "ExampleClientComponentHydrateTree";
