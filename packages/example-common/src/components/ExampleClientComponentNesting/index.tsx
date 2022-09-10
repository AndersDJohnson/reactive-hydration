import { lazy } from "react";
import { useRecoilState } from "recoil";
import { textState } from "../../state/textState";

// This is just a trick to get the nested component out of the bundle for this ancestor component.
// This would probably be handled by a compile step that would rewrite the import:
// `import { ExampleClientComponent } from '../ExampleClientComponent.lazy';`
// after generating a lazy file next to the component.
const ExampleClientComponent = lazy(() =>
  import("../ExampleClientComponent").then((mod) => ({
    default: mod.ExampleClientComponent,
  }))
);

// @ts-expect-error This property is only known to us.
ExampleClientComponent.displayName = "ExampleClientComponent";
// TODO: Copy `states` any other static properties?
// @ts-expect-error This property is only known to us.
ExampleClientComponent.reactiveHydrateLoader = true;

// const ExampleClientComponent1 = lazy(() =>
//   import("../ExampleClientComponent1").then((mod) => ({
//     default: mod.ExampleClientComponent1,
//   }))
// );

// const ExampleClientComponent2 = lazy(() =>
//   import("../ExampleClientComponent2").then((mod) => ({
//     default: mod.ExampleClientComponent2,
//   }))
// );

export const ExampleClientComponentNesting = () => {
  const [text] = useRecoilState(textState);

  return (
    <>
      <h4>ExampleClientComponentNesting</h4>

      <div>recoil textState = {text}</div>

      <button data-click>hydrate</button>

      <div
        style={{
          paddingLeft: 48,
          paddingTop: 12,
        }}
      >
        <span>lazy:</span>
        <ExampleClientComponent />

        {/* <ExampleClientComponent1 />

        <ExampleClientComponent2 /> */}
      </div>
    </>
  );
};

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";
ExampleClientComponentNesting.states = "textState";
