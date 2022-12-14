import { Alignment, Input, Scene } from "@sceneify/core";
import {
  NoiseGateFilter,
  NoiseSuppressFilter,
  NoiseSuppressMethod,
} from "@sceneify/filters";
import {
  BrowserSource,
  MacAudioInputCapture,
  MacOSScreenCapture,
  VideoCaptureSource,
} from "@sceneify/sources";
import { BlurFilter } from "@sceneify/streamfx";
import { AnimateLayoutArgs } from "../../utils";

export const CAM_HEIGHT = 350;
export const CAM_WIDTH = (CAM_HEIGHT * 16) / 9;

export const GAP = 20;

export const webcam = new VideoCaptureSource({
  name: "Webcam",
  settings: {},
});

export const display = new MacOSScreenCapture({
  name: "Display",
  filters: {
    blur: new BlurFilter({
      enabled: false,
      name: "Blur",
      settings: {
        "Filter.Blur.Type": "box",
        "Filter.Blur.Subtype": "area",
        "Filter.Blur.Size": 30,
      },
    }),
  },
});

export const micInput = new MacAudioInputCapture({
  name: "Mic Audio",
  settings: {
    // TODO: mono
  },
  filters: {
    supression: new NoiseSuppressFilter({
      name: "Noise Suppress",
      settings: {
        method: NoiseSuppressMethod.Speex,
      },
    }),
    gate: new NoiseGateFilter({
      name: "Noise Gate",
      settings: {
        open_threshold: -35,
        close_threshold: -45,
      },
    }),
  },
});

export const mainScene = new Scene({
  name: "Main",
  items: {
    camera: {
      source: webcam,
      alignment: Alignment.BottomRight,
      positionX: 1920 - GAP,
      positionY: 1080 - GAP,
      cropLeft: 300,
      cropRight: 300,
    },
    guest: {
      source: new BrowserSource({
        name: "Guest",
        settings: {
          width: 1920,
          height: 1080,
          url: "https://ping.gg/call/brendonovich/embed?view=cl8287d6q12920gmk8bbjyff5",
        },
      }),
      alignment: Alignment.BottomRight,
    },
    chat: {
      source: new BrowserSource({
        name: "Chat",
        settings: {
          url: import.meta.env.VITE_CHAT_WIDGET_URL,
          width: 1000,
        },
      }),
      positionX: 1920 - GAP,
      alignment: Alignment.BottomRight,
    },
    discordServer: {
      source: new BrowserSource({
        name: "Discord Server",
        settings: {
          url: "https://streamkit.discord.com/overlay/status/949090953497567312?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=0&invite_code=XpctyaUgG8&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0",
          width: 312,
          height: 64,
        },
      }),
      alignment: Alignment.TopRight,
      positionX: 1920 - GAP,
      positionY: GAP,
    },
    streamkitVoice: {
      source: new BrowserSource({
        name: "Streamkit Voice",
        settings: {
          url: "https://streamkit.discord.com/overlay/voice/949090953497567312/966581199025893387?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=0&invite_code=XpctyaUgG8&limit_speaking=true&small_avatars=false&hide_names=false&fade_chat=0",
        },
      }),
    },
    display: {
      source: display,
      positionX: 0,
      positionY: 0,
    },
    micAudio: {
      source: micInput,
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
  },
});

export function fullscreenLayout(): AnimateLayoutArgs<any> {
  const camera = mainScene.item("camera");
  const guest = mainScene.item("guest");

  const cameraLayout = {
    cropLeft: 300,
    cropRight: 300,
    positionX: 1920 - GAP,
    positionY: 1080 - GAP,
    scaleX: CAM_WIDTH / camera.transform.sourceWidth,
    scaleY: CAM_HEIGHT / camera.transform.sourceHeight,
  };

  const guestLayout = {
    cropLeft: 300,
    cropRight: 300,
    positionX: cameraLayout.positionX - GAP - guest.transform.width,
    positionY: 1080 - GAP,
    scaleX: 0.4, // CAM_WIDTH / guest.source.settings.width!,
    scaleY: 0.4, //CAM_HEIGHT / guest.source.settings.height!,
  };

  return {
    ms: 300,
    subjects: {
      camera,
      chat: mainScene.item("chat"),
      guest: mainScene.item("guest"),
    },
    layouts: {
      camera: cameraLayout,
      chat: {
        positionY:
          cameraLayout.positionY -
          cameraLayout.scaleY * camera.transform.sourceHeight,
        positionX: 1920 - GAP,
      },
      guest: guestLayout,
    },
  };
}

export function fullcamLayout(): AnimateLayoutArgs<any> {
  const camera = mainScene.item("camera");

  return {
    ms: 300,
    subjects: {
      camera,
      chat: mainScene.item("chat"),
    },
    layouts: {
      camera: {
        cropLeft: 0,
        cropRight: 0,
        positionX: 1920,
        positionY: 1080,
        scaleX: 1920 / camera.transform.sourceWidth,
        scaleY: 1080 / mainScene.item("camera").transform.sourceHeight,
      },
      chat: {
        positionX: 1920,
        positionY: 1080,
      },
    },
  };
}
