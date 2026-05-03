// PORT TARGET: web-stencil/src/components/gui-welcome/gui-welcome.tsx — buba() method
// The "treat" button at the end of the welcome bio. Plays jumpSoft.mp3 and
// adds a "Binary fruit frosties generated" log entry to the console viewer.

import { addLog } from '../../stores/shell';
import { playSound } from '../../services/sound';
import { DEFAULT_PLAYER } from '../../data/welcome-player';

interface Props {
  label?: string;
}

export default function SoundButton(props: Props) {
  const onClick = () => {
    playSound('jumpSoft', 1);
    addLog({
      message: `Dattebayo! 🍭🍬 <br />Binary fruit frosties generated. <br /><small style="color:#585858;line-height:.9">${DEFAULT_PLAYER.digiCode}</small>`,
      file: 'daijōbu.wasm',
      time: new Date(),
      line: 501,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      class="mx-auto block text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-colors"
    >
      {/* TODO: i18n welcome.button */}
      {props.label ?? 'Get a treat'}
    </button>
  );
}
