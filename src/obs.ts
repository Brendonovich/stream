import { Alignment, CustomInputArgs, Input, Scene, SourceFilters } from "@sceneify/core";
import { NoiseGateFilter, NoiseSuppressFilter, NoiseSuppressMethod } from "@sceneify/filters";
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
		}),
		gate: new NoiseGateFilter({
			name: "Noise Gate",
			settings: {
				open_threshold: -35,
				close_threshold: -45
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
			positionX: 1920 - 20,
			positionY: 770,
			alignment: Alignment.BottomRight
		},
		discordServer: {
			source: new BrowserSource({
				name: "Discord Server",
				settings: {
					url: "https://streamkit.discord.com/overlay/status/949090953497567312?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=0&invite_code=XpctyaUgG8&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0",
					width: 312,
					height: 64
				},
			}),
			alignment: Alignment.TopRight,
			positionX: 1920-10,
			positionY: 10
		},
	}
})
