import { Easing, setDefaultEasing, wait } from "@sceneify/animation";
import { OBS } from "@sceneify/core";

import { animateLayout, setSettingsFromPropertyList } from "../utils";
import {
  display,
  fullscreenLayout,
  mainScene,
  micInput,
  webcam,
} from "./scenes/main";

setDefaultEasing(Easing.InOut);

export async function initialize() {
  const obs = new OBS();

  await obs.connect("ws://localhost:4455");

  const videoSettings = await obs.call("GetVideoSettings");

  await mainScene.create(obs);
  await mainScene.makeCurrentScene();

  await setSettingsFromPropertyList(display, "display", (i) =>
    i.name.includes("LG")
  );

  const displayItem = mainScene.item("display");
  await mainScene.item("display").setTransform({
    scaleX: videoSettings.baseWidth / displayItem.transform.sourceWidth,
    scaleY: videoSettings.baseHeight / displayItem.transform.sourceHeight,
  });

  mainScene.item("systemAudio").source.setVolume({
    db: -8,
  });

  await setSettingsFromPropertyList(micInput, "device_id", (i) =>
    i.name.includes("USB Audio")
  );

  await setSettingsFromPropertyList(webcam, "device", (i) =>
    i.name.includes("C922")
  );

  await mainScene.item("camera").fetchProperties();

  await animateLayout(fullscreenLayout());

  await obs.clean();
}
