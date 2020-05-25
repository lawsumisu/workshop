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
        dispatchInsertKeyPressEvent(getKey(button, direction));
      }
      dispatchEvent(new CustomEvent('gamepadDirection', { detail: direction - 1 }));
      dispatchEvent(new CustomEvent('gamepadKeyDown', { detail: downInputs }));
      break;
    }
    case Mode.SELECT: {
      const isActiveSelection = inputs.X.isDown;
      _.forEach(inputs, (value: { duration: number; isDown: boolean }, key: GamepadInput) => {
        if (value.isDown && directionInputs.has(key)) {
          dispatchSelectKeyDirectionEvent({ key, isActiveSelection });
        }
      });
      break;
    }
  }
  const confirmationKey = getConfirmationKey();
  if (confirmationKey.key) {
    dispatchConfirmationKeyDownEvent(confirmationKey.key, !confirmationKey.isHeld);
  }
}

function getDispatchKeyEventFn<T = any>(
  key: GPKeyEvent,
  options: Partial<{ throttle: number; settings: _.ThrottleSettings; wait: number }> = {}
): (detail: T, reset?: boolean) => void {
  const ops = {
    throttle: 50,
    settings: {},
    wait: 0,
    ...options,
  };
  let isPaused = true;
  let isWaiting = false;
  let timeoutId: number | null = null;
  return _.throttle(
    (detail, reset = false) => {
      if (reset) {
        isWaiting = false;
        isPaused = true;
      }
      if (!isWaiting || !isPaused) {
        dispatchEvent(new CustomEvent(key, { detail }));
      }
      if (!isWaiting) {
        isWaiting = true;
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
          isPaused = false;
        }, ops.wait);
      }
    },
    ops.throttle,
    ops.settings
  );
}

const dispatchSelectKeyDirectionEvent = getDispatchKeyEventFn<{ key: GamepadInput; isActiveSelection: boolean }>(
  GPKeyEvent.SELECT_KEY_DIRECTION
);
const dispatchInsertKeyPressEvent = getDispatchKeyEventFn<string | null>(GPKeyEvent.INSERT_KEY_PRESS);
const dispatchConfirmationKeyDownEvent = getDispatchKeyEventFn<KeyAction | null>(GPKeyEvent.INSERT_KEY_PRESS, {
  settings: { leading: true, trailing: false },
  wait: 400,
});

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
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting },
    { [input in KeyInput]?: KeySetting }
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
  const S2 = GPR.inputs.L2.isDown;
  const key = keyMap.EN[direction - 1][button];
  return (key && ((S2 && key.shift2) || (S1 && key.shift1) || key.default)) || '';
}

function getConfirmationKey(): { key: KeyAction | null; isHeld: boolean } {
  const inputs = GPR.inputs;
  const backspaceKey = GamepadInput.B;
  const deleteKey = GamepadInput.Y;
  const isEnterInputted = GPR.isReleased(GamepadInput.R2, 16);
  if (inputs[backspaceKey].isDown && inputs.R2.isDown) {
    return { key: KeyAction.BACKSPACE, isHeld: !GPR.isPressed(backspaceKey) };
  } else if (inputs[deleteKey].isDown && inputs.R2.isDown) {
    return { key: KeyAction.DELETE, isHeld: !GPR.isPressed(deleteKey) };
  } else {
    return { key: isEnterInputted ? KeyAction.ENTER : null, isHeld: false };
  }
}
