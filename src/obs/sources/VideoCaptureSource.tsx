import { Alignment, CustomInputArgs, Input, Scene, SourceFilters } from "@sceneify/core";
import { NoiseGateFilter, NoiseSuppressFilter, NoiseSuppressMethod } from "@sceneify/filters";
import { BrowserSource, ColorSource } from "@sceneify/sources";

export type VideoCaptureSourceSettings = {
  device: string;
  device_name: string;
  use_preset: boolean;
  buffering: boolean;
};

export class VideoCaptureSource<
  Filters extends SourceFilters = {}
> extends Input<VideoCaptureSourceSettings, Filters> {
  constructor(args: CustomInputArgs<VideoCaptureSourceSettings, Filters>) {
    super({
      ...args,
      kind: "av_capture_input_v2",
    });
  }
}
