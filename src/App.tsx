import { createSignal, Show } from "solid-js";

import { Button } from "./components/ui/Button";
import { initialize } from "./obs";
import {
  display,
  fullcamLayout,
  fullscreenLayout,
  micInput,
} from "./obs/scenes/main";
import { animateLayout } from "./utils";

initialize();

function App() {
  const [fullcam, setFullcam] = createSignal(false);

  return (
    <div class="bg-gray-200 w-screen h-screen p-4 space-x-2">
      <Button
        onClick={() => {
          display.filter("blur").setEnabled(!display.filter("blur").enabled);
        }}
      >
        Toggle Blur
      </Button>
      <Button onClick={() => micInput.toggleMuted()}>Toggle Mute</Button>
      <Button
        onClick={() => {
          setFullcam((f) => {
            animateLayout(f ? fullscreenLayout() : fullcamLayout());

            return !f;
          });
        }}
      >
        <Show when={!fullcam()} fallback="Go Fullscreen">
          Go Fullcam
        </Show>
      </Button>
    </div>
  );
}

export default App;
