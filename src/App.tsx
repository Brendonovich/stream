import { OBS } from "@sceneify/core";
import { display, mainScene, micInput, webcam } from "./obs"

async function main() {
	const obs = new OBS();

	await obs.connect("ws://localhost:4455");

	await mainScene.create(obs);

	let cameraInputs = await obs.call("GetInputPropertiesListPropertyItems", {
		inputName: webcam.name,
		propertyName: "device"
	});

	const webcamInput = cameraInputs.propertyItems.find(i => (i as any).itemName.includes("C922"));

	await webcam.setSettings({
		device: (webcamInput as any).itemValue
	})

	const displayInputs = await obs.call("GetInputPropertiesListPropertyItems", {
		inputName: display.name,
		propertyName: "display"
	})

	const displayInput = displayInputs.propertyItems.find(i => (i as any).itemName.includes("LG"));

	console.log(displayInput)

	await display.setSettings({
		display: (displayInput as any).itemValue
	})

	await mainScene.item("display").setTransform({
		scaleX: 1920 / mainScene.item("display").transform.sourceWidth,
		scaleY: 1080 / mainScene.item("display").transform.sourceHeight,
	})

	mainScene.item("systemAudio").source.setVolume({
		db: -8
	})

	const micInputs = await obs.call("GetInputPropertiesListPropertyItems", {
		inputName: micInput.name,
		propertyName: "device_id"
	});

	const micInputDevice = micInputs.propertyItems.find(i => (i as any).itemName.includes("USB Audio"));

	await micInput.setSettings({
		device_id: (micInputDevice as any).itemValue
	})

	await mainScene.makeCurrentScene();
}

function Button(props: any) {
	return <button {...props} class="p-2 font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600" />
}

function App() {
	main();

	return (
		<div class="bg-gray-200 w-screen h-screen p-4 space-x-2">
			<Button onClick={() => {
				display.filter("blur").setEnabled(!display.filter("blur").enabled)
			}}>
				Toggle Blur
			</Button>
			<Button onClick={() => micInput.toggleMuted()}>
				Toggle Mute
			</Button>
		</div>
	);
}

export default App;
