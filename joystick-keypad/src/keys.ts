import { ButtonInput, buttonInputs, directionInputs, GamepadInfo, GamepadInput, GPR } from 'src/gamepad';
import * as _ from 'lodash';

const priority = {
  [GamepadInput.A]: 1,
  [GamepadInput.B]: 3,
  [GamepadInput.X]: 0,
  [GamepadInput.Y]: 2,
  [GamepadInput.R1]: 4,
};

export enum GPKeyEvent {
  INSERT_KEY_PRESS = 'INSERT_KEY_PRESS',
  INSERT_KEY_DIRECTION = 'INSERT_KEY_DIRECTION',
  SELECT_KEY_DIRECTION = 'SELECT_KEY_DIRECTION',
}

enum Mode {
  INSERT = 'INSERT',
  SELECT = 'SELECT',
}

export function updateKeys(): void {
  const inputs = GPR.inputs;
  const mode = inputs.R2.isDown ? Mode.SELECT : Mode.INSERT;
  const downInputs = _.keys(inputs)
    .filter((key: GamepadInput) => inputs[key].isDown && buttonInputs.has(key))
    .sort((a: GamepadInput, b: GamepadInput) => priority[a] - priority[b]) as ButtonInput[];
  const pressedInputs = _.chain(downInputs)
    .filter((key: GamepadInput) => inputs[key].duration === 1)
    .sort((a: GamepadInput, b: GamepadInput) => priority[a] - priority[b])
    .value();
  const direction = getDirection(inputs);

  switch (mode) {
    case Mode.INSERT: {
      if (pressedInputs.length > 0) {
        const button: ButtonInput = pressedInputs[0];
        dispatchEvent(new CustomEvent('gamepadKeyPress', { detail: getKey(button, direction) }));
      }
      dispatchEvent(new CustomEvent('gamepadDirection', { detail: direction - 1 }));
      dispatchEvent(new CustomEvent('gamepadKeyDown', { detail: downInputs }));
      break;
    }
    case Mode.SELECT: {
      const isActiveSelection = inputs.X.isDown;
      _.forEach(inputs, (value: { duration: number; isDown: boolean }, key: GamepadInput) => {
        if (value.isDown && directionInputs.has(key)) {
          dispatchKeyEvent(GPKeyEvent.SELECT_KEY_DIRECTION, { key, isActiveSelection });
        }
      });
      break;
    }
  }
  const confirmationKey = getConfirmationKey();
  if (confirmationKey) {
    dispatchEvent(new CustomEvent('gamepadKeyPress', { detail: confirmationKey }));
  }
}

const dispatchKeyEvent = _.throttle(
  <T>(name: GPKeyEvent, detail: T) => {
    console.log(`Dispatching: ${name}`);
    dispatchEvent(new CustomEvent(name, { detail }));
  },
  50,
  { leading: true, trailing: false }
);

function getDirection(inputs: GamepadInfo): number {
  return _.keys(inputs)
    .filter((key: GamepadInput) => inputs[key].isDown && directionInputs.has(key))
    .reduce((direction, key: GamepadInput) => {
      switch (key) {
        case GamepadInput.RIGHT:
          return direction + 1;
        case GamepadInput.LEFT:
          return direction - 1;
        case GamepadInput.UP:
          return direction + 3;
        case GamepadInput.DOWN:
          return direction - 3;
        default:
          return direction;
      }
    }, 5);
}

type KeyInput = Exclude<ButtonInput, GamepadInput.R2>;

interface KeySetting {
  default: string;
  shift1?: string;
  shift2?: string;
}

const keyMap: {
  [key in KeyInput]: [
    KeySetting,
    KeySetting,
    KeySetting,
    KeySetting,
    KeySetting,
    KeySetting,
    KeySetting,
    KeySetting,
    KeySetting
    ];
} = {
  [GamepadInput.X]: [
    {
      default: 'q',
      shift1: 'Q',
    },
    {
      default: 'v',
      shift1: 'V',
    },
    {
      default: '.',
    },
    {
      default: 'l',
      shift1: 'L',
    },
    {
      default: 'e',
      shift1: 'E',
    },
    {
      default: '1',
    },
    {
      default: 'g',
      shift1: 'G',
    },
    {
      default: 'b',
      shift1: 'B',
    },
    {
      default: '6',
    },
  ],
  [GamepadInput.A]: [
    {
      default: 'r',
      shift1: 'R',
    },
    {
      default: 'w',
      shift1: 'W',
    },
    {
      default: ',',
    },
    {
      default: 'm',
      shift1: 'M',
    },
    {
      default: 'i',
      shift1: 'I',
    },
    {
      default: '2',
    },
    {
      default: 'h',
      shift1: 'H',
    },
    {
      default: 'c',
      shift1: 'C',
    },
    {
      default: '7',
    },
  ],
  [GamepadInput.Y]: [
    {
      default: 's',
      shift1: 'S',
    },
    {
      default: 'x',
      shift1: 'X',
    },
    {
      default: 'z',
      shift1: 'Z'
    },
    {
      default: 'n',
      shift1: 'N',
    },
    {
      default: 'a',
      shift1: 'A',
    },
    {
      default: '3',
    },
    {
      default: 'j',
      shift1: 'J',
    },
    {
      default: 'd',
      shift1: 'D',
    },
    {
      default: '8',
    },
  ],
  [GamepadInput.B]: [
    {
      default: 't',
      shift1: 'T',
    },
    {
      default: 'y',
      shift1: 'Y',
    },
    {
      default: '?',
    },
    {
      default: 'p',
      shift1: 'P',
    },
    {
      default: 'o',
      shift1: 'O',
    },
    {
      default: '4',
    },
    {
      default: 'k',
      shift1: 'K',
    },
    {
      default: 'f',
      shift1: 'F',
    },
    {
      default: '9',
    },
  ],
  [GamepadInput.R1]: [
    {
      default: '',
    },
    {
      default: '',
    },
    {
      default: '',
    },
    {
      default: '',
    },
    {
      default: 'u',
      shift1: 'U'
    },
    {
      default: '0',
    },
    {
      default: '',
    },
    {
      default: '',
    },
    {
      default: '5',
    },
  ]
};

export enum KeyAction {
  ENTER = 'ENTER',
  BACKSPACE = 'BACKSPACE',
  DELETE = 'DELETE',
}

export function getKey(button: ButtonInput, direction: number): string {
  const S1 = GPR.inputs.L1.isDown;
  const key = keyMap[button][direction - 1];
  return (S1 && key.shift1) || key.default;
}

function getConfirmationKey(): KeyAction | null {
  const inputs = GPR.inputs;
  const backspaceKey = GamepadInput.B;
  const deleteKey = GamepadInput.Y;
  const isEnterInputted = GPR.isReleased(GamepadInput.R2, 16);
  if ((inputs[backspaceKey].isDown && isEnterInputted) || (GPR.isPressed(backspaceKey) && inputs.R2.isDown)) {
    return KeyAction.BACKSPACE;
  } else if ((inputs[deleteKey].isDown && isEnterInputted) || (GPR.isPressed(deleteKey) && inputs.R2.isDown)) {
    return KeyAction.DELETE;
  } else {
    return isEnterInputted ? KeyAction.ENTER : null;
  }
}
