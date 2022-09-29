import { CustomInputArgs, Input, SourceFilters } from "@sceneify/core";

export class DisplayCaptureSource<F extends SourceFilters> extends Input<{ display: string }, F> {
	constructor(options: CustomInputArgs<{ display: string }, F>) {
		super({
			...options,
			kind: "display_capture"
		});
	}
}
