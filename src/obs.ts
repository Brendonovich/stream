import { Alignment, CustomInputArgs, Input, Scene, SourceFilters } from "@sceneify/core";
import { NoiseSuppressFilter, NoiseSuppressMethod } from "@sceneify/filters";
import { BrowserSource, VideoCaptureSource } from "@sceneify/sources";
import { BlurFilter } from "@sceneify/streamfx";

class DisplayCaptureSource<F extends SourceFilters> extends Input<{ display: string }, F> {
	constructor(options: CustomInputArgs<{ display: string }, F>) {
		super({
			...options,
			kind: "display_capture"
		});
	}
}

export const webcam = new VideoCaptureSource({
	name: "Webcam",
	settings: {}
});

export const display = new DisplayCaptureSource({
	name: "Display",
	filters: {
		blur: new BlurFilter({
			enabled: false,
			name: "Blur",
			settings: {
				"Filter.Blur.Type": "box",
				"Filter.Blur.Subtype": "area",
				"Filter.Blur.Size": 30
			}
		})
	}
})

export const micInput = new Input({
	name: "Mic Audio",
	kind: "coreaudio_input_capture",
	settings: {
		// TODO: mono
	},
	filters: {
		supression: new NoiseSuppressFilter({
			name: "Noise Suppress",
			settings: {
				method: NoiseSuppressMethod.Speex
			}
		})
	}
})

export const mainScene = new Scene({
	name: "Main",
	items: {
		micAudio: {
			source: micInput
		},
		systemAudio: {
			source: new Input({
				name: "System Audio",
				kind: "coreaudio_input_capture",
				settings: {
					device_id: "BlackHole16ch_UID",
				},
				// TODO
				// volume: {
				// 	db: -8
				// }
			}),

		},
		display: {
			source: display,
			positionX: 0,
			positionY: 0,
		},
		camera: {
			source: webcam,
			alignment: Alignment.BottomRight,
			positionX: 1920 - 30,
			positionY: 1080 - 30,
			scaleX: 0.4,
			scaleY: 0.4
		},
		chat: {
			source: new BrowserSource({
				name: "Chat",
				settings: {
					url: import.meta.env.VITE_CHAT_WIDGET_URL,
					width: 810,
					height: 810
				},
			}),
			positionX: 1920 - 30,
			positionY: 760,
			alignment: Alignment.BottomRight
		}
	}
})
