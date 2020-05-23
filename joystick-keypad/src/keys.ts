import { ButtonInput, buttonInputs, directionInputs, GamepadInfo, GamepadInput, GPR } from 'src/gamepad';
import * as _ from 'lodash';
import config from 'src/config.json';

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

type KeyConfig = {
  EN: [
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; },
    { [input in KeyInput]?: KeySetting; }
  ];
};

export enum KeyAction {
  ENTER = 'ENTER',
  BACKSPACE = 'BACKSPACE',
  DELETE = 'DELETE',
}

export function getKey(button: ButtonInput, direction: number): string {
  const keyMap = config as KeyConfig;
  const S1 = GPR.inputs.L1.isDown;
  const key = keyMap.EN[direction - 1][button];
  return key && ((S1 && key.shift1) || key.default) || "";
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
