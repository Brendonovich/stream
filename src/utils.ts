import { animate, AnimationSubject, SubjectKeyframeValues } from "@sceneify/animation";

export type SubjectLayoutValues<T extends AnimationSubject> = { [K in keyof SubjectKeyframeValues<T>]: number };

export interface AnimateLayoutArgs<TSubjects extends Record<string, AnimationSubject>> {
  ms: number,
  subjects: TSubjects,
  layouts: {
    [K in keyof TSubjects]: SubjectLayoutValues<TSubjects[K]>
  }
}

export function animateLayout<TArgs extends AnimateLayoutArgs<TSubjects>, TSubjects extends Record<string, AnimationSubject>>(args: TArgs) {
  return animate({
    subjects: args.subjects,
    keyframes: Object.keys(args.subjects).reduce((acc, subject) => ({
      ...acc,
      [subject]: Object.entries(args.layouts[subject]).reduce((acc, [property, value]) => ({
        ...acc,
        [property]: {
          [args.ms]: value
        }
      }), {} as any)
    }), {} as any)
  })
}
