import {
  animate,
  AnimationSubject,
  SubjectKeyframeValues,
} from "@sceneify/animation";
import { Input, PropertyList, PropertyLists } from "@sceneify/core";
import { MacOSScreenCapture } from "@sceneify/sources";

export type SubjectLayoutValues<T extends AnimationSubject> = {
  [K in keyof SubjectKeyframeValues<T>]: number;
};

export interface AnimateLayoutArgs<
  TSubjects extends Record<string, AnimationSubject>
> {
  ms: number;
  subjects: TSubjects;
  layouts: {
    [K in keyof TSubjects]: SubjectLayoutValues<TSubjects[K]>;
  };
}

export function animateLayout<
  TArgs extends AnimateLayoutArgs<TSubjects>,
  TSubjects extends Record<string, AnimationSubject>
>(args: TArgs) {
  return animate({
    subjects: args.subjects,
    keyframes: Object.keys(args.subjects).reduce(
      (acc, subject) => ({
        ...acc,
        [subject]: Object.entries(args.layouts[subject]).reduce(
          (acc, [property, value]) => ({
            ...acc,
            [property]: {
              [args.ms]: value,
            },
          }),
          {} as any
        ),
      }),
      {} as any
    ),
  });
}

export function dbg<T>(v: T) {
  console.log(v);
  return v;
}

export async function setSettingsFromPropertyList<
  TInput extends Input<any, any, TPropertyList>,
  TProperty extends keyof TPropertyList,
  TPropertyList extends PropertyLists
>(
  input: TInput,
  property: TProperty,
  findFn: (i: PropertyList<TPropertyList[typeof property]>[number]) => boolean
) {
  const items = await input.getPropertyListItems(property);
  const item = items.find(findFn);
  if (item && input.settings[property] !== item.value) {
    input.setSettings({
      [property]: item.value,
    });
  }
}
