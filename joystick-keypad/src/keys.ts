import { buttonsInputs, directionInputs, GamepadInfo, GamepadInput, GPR } from 'src/gamepad';
import * as _ from 'lodash';

const priority = {
  [GamepadInput.A]: 1,
  [GamepadInput.B]: 3,
  [GamepadInput.X]: 0,
  [GamepadInput.Y]: 2,
  [GamepadInput.R1]: 4,
  [GamepadInput.R2]: 5
};

export function updateKeys(): void {
  const inputs = GPR.inputs;
  const downInputs = _.keys(inputs)
    .filter((key: GamepadInput) => inputs[key].isDown && buttonsInputs.has(key))
    .sort((a: GamepadInput, b: GamepadInput) => priority[a] - priority[b]);
  const pressedInputs = _.chain(downInputs)
    .filter((key: GamepadInput) => inputs[key].duration === 1)
    .sort((a: GamepadInput, b: GamepadInput) => priority[a] - priority[b])
    .value();
  const direction = getDirection(inputs);
  if (pressedInputs.length > 0) {
    const button = pressedInputs[0];
    const key = keyMap[button][direction - 1];
    dispatchEvent(new CustomEvent('gamepadKeyPress', { detail: key }))
  }
  dispatchEvent(new CustomEvent('gamepadDirection', { detail: direction - 1}));
  dispatchEvent(new CustomEvent('gamepadKeyDown', { detail: downInputs }))
}

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

export const keyMap: {[key in GamepadInput]?: [string, string, string, string, string, string, string, string, string]} = {
  [GamepadInput.A]: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
  [GamepadInput.X]: ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
  [GamepadInput.Y]: ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0'],
  [GamepadInput.B]: ['1', '2', '3', '4', '5' ,'6', '7', '8', '9'],
};