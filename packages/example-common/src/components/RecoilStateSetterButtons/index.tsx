import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";

export const RecoilStateSetterButtons = () => {
  const [, setText] = useRecoilState(textState);

  const handleClick = useCallback(() => {
    setText(`(client value: ${Math.random()}`);
  }, [setText]);

  const [, setText2] = useRecoilState(text2State);

  const handleClick2 = useCallback(() => {
    setText2(`(client value: ${Math.random()}`);
  }, [setText2]);

  return (
    <>
      <button onClick={handleClick}>Update text on client</button>
      <button onClick={handleClick2}>Update text 2 on client</button>
    </>
  );
};
