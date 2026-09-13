import { Callout, QuickCheck } from "./lesson-components";

export function mdxComponents() {
  return {
    Callout,
    QuickCheck: (props: { answer: string }) => <QuickCheck {...props} />,
  };
}
