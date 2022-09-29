import { Easing, setDefaultEasing } from "@sceneify/animation";
import { OBS } from "@sceneify/core";

import { animateLayout } from "../utils";
import { CAM_HEIGHT, CAM_WIDTH, display, fullscreenLayout, GAP, mainScene, micInput, webcam } from "./scenes/main";

setDefaultEasing(Easing.InOut)

export async function initialize() {
  const obs = new OBS();

  await obs.connect("ws://localhost:4455");

  const videoSettings = await obs.call(["GetVideoSettings"]);

  await mainScene.create(obs);

  const displayInputs = await obs.call(["GetInputPropertiesListPropertyItems", {
    inputName: display.name,
    propertyName: "display"
  }])

  const displayInput = displayInputs.propertyItems.find(i => (i as any).itemName.includes("LG"));

  if(displayInput !== display.settings.display)
    await display.setSettings({
      display: (displayInput as any).itemValue,
    })

  await mainScene.item("display").setTransform({
    scaleX: videoSettings.baseWidth / mainScene.item("display").transform.sourceWidth,
    scaleY: videoSettings.baseHeight / mainScene.item("display").transform.sourceHeight,
  })

  mainScene.item("systemAudio").source.setVolume({
      db: -8
  })

  const micInputs = await obs.call(["GetInputPropertiesListPropertyItems", {
    inputName: micInput.name,
    propertyName: "device_id"
  }]);

  const micInputDevice = micInputs.propertyItems.find(i => (i as any).itemName.includes("USB Audio"));

  await micInput.setSettings({
      device_id: (micInputDevice as any).itemValue
  })
  let cameraInputs = await obs.call(["GetInputPropertiesListPropertyItems", {
    inputName: webcam.name,
    propertyName: "device"
  }]);

  const webcamInput = cameraInputs.propertyItems.find(i => (i as any).itemName.includes("C922"));

  if(webcam.settings.device !== webcamInput)
    await webcam.setSettings({
      device: (webcamInput as any).itemValue
    })

  await animateLayout(fullscreenLayout())

  await obs.clean();

  await mainScene.makeCurrentScene();
}
