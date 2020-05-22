import * as _ from 'lodash';

export enum GamepadInput {
  A = 'A',
  B = 'B',
  X = 'X',
  Y = 'Y',
  L1 = 'L1',
  R1 = 'R1',
  L2 = 'L2',
  R2 = 'R2',
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE',
}

export type ButtonInput = GamepadInput.A | GamepadInput.B | GamepadInput.Y | GamepadInput.X | GamepadInput.R1;
export type DirectionInput = GamepadInput.DOWN | GamepadInput.UP | GamepadInput.LEFT | GamepadInput.RIGHT;

function toSet<T>(list: Array<T>): Set<T> {
  return list.reduce((set, item: T) => {
    set.add(item);
    return set;
  }, new Set<T>());
}

export const buttonInputs = toSet([
  GamepadInput.A,
  GamepadInput.B,
  GamepadInput.X,
  GamepadInput.Y,
  GamepadInput.R1,
]);

export const directionInputs = toSet([GamepadInput.DOWN, GamepadInput.UP, GamepadInput.LEFT, GamepadInput.RIGHT]);

export type GamepadInfo = {
  [key in GamepadInput]: {
    previousDuration: number;
    duration: number;
    isDown: boolean;
  };
};

class GamepadReader {
  private static inputs = [
    GamepadInput.A,
    GamepadInput.B,
    GamepadInput.X,
    GamepadInput.Y,
    GamepadInput.L1,
    GamepadInput.R1,
    GamepadInput.L2,
    GamepadInput.R2,
    GamepadInput.NONE,
    GamepadInput.NONE,
    GamepadInput.NONE,
    GamepadInput.NONE,
    GamepadInput.UP,
    GamepadInput.DOWN,
    GamepadInput.LEFT,
    GamepadInput.RIGHT,
  ];

  private inputState: GamepadInfo;
  private cachedInfo: GamepadInfo | null = null;

  constructor() {
    this.clear();
  }

  public update(): void {
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      const gamepad = gamepads[0];
      _.forEach(GamepadReader.inputs, (input: GamepadInput, index: number) => {
        let isDown = gamepad.buttons[index].pressed;
        const isButtonTransitioning = this.inputState[input].isDown !== isDown;
        const { duration: previousDurationOnTransition } = this.inputState[input];
        if (isButtonTransitioning) {
          // Input was either just pressed or just released, so reset duration
          this.inputState[input].duration = 0
        }
        const { duration, previousDuration } = this.inputState[input];
        this.inputState[input] = {
          isDown,
          previousDuration: isButtonTransitioning ? previousDurationOnTransition : previousDuration,
          duration: duration + 1,
        };
      });
    }
    this.cachedInfo = null;
  }

  public clear(): void {
    this.inputState = _.reduce(
      GamepadInput,
      (accumulator, input: GamepadInput) => {
        accumulator[input] = { duration: 0, isDown: false, previousDuration: 0 };
        return accumulator;
      },
      {}
    ) as GamepadInfo;
    this.cachedInfo = null;
  }

  public get inputs(): GamepadInfo {
    return this.cachedInfo === null ? _.reduce(
      this.inputState,
      (accumulator, value, key) => {
        accumulator[key] = { ...value };
        return accumulator;
      },
      {}
    ) as GamepadInfo : this.cachedInfo;
  }

  public isPressed(key: GamepadInput): boolean {
    return this.inputs[key].isDown && this.inputs[key].duration === 1;
  }

  public isReleased(key: GamepadInput, window = 1): boolean {
    const input = this.inputs[key];
    return !input.isDown && input.duration === 1 && input.previousDuration <= window && input.previousDuration > 0;
  }
}

export const GPR = new GamepadReader();
