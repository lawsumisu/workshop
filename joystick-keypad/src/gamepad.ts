import * as _ from "lodash";

export enum GamepadInput {
  A = "A",
  B = "B",
  X = "X",
  Y = "Y",
  L1 = "L1",
  R1 = "R1",
  L2 = "L2",
  R2 = "R2",
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  NONE = "NONE",
}

export const buttonsInputs = [
  GamepadInput.A,
  GamepadInput.B,
  GamepadInput.X,
  GamepadInput.Y,
  GamepadInput.R1,
  GamepadInput.R2,
].reduce((set, button: GamepadInput) => {
  set.add(button);
  return set;
}, new Set<GamepadInput>());

export const directionInputs = [
  GamepadInput.DOWN,
  GamepadInput.UP,
  GamepadInput.LEFT,
  GamepadInput.RIGHT,
].reduce((set: Set<GamepadInput>, button: GamepadInput) => {
  set.add(button);
  return set;
}, new Set<GamepadInput>());

export type GamepadInfo = {
  [key in GamepadInput]: {
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

  constructor() {
    this.clear();
  }

  public update(): void {
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      const gamepad = gamepads[0];
      _.forEach(GamepadReader.inputs, (input: GamepadInput, index: number) => {
        let isDown = gamepad.buttons[index].pressed;
        if (this.inputState[input].isDown !== isDown) {
          // Input was either just pressed or just released, so reset duration
          this.inputState[input].duration = 0;
        }
        this.inputState[input] = {
          isDown,
          duration: this.inputState[input].duration + 1,
        };
      });
    }
  }

  public clear(): void {
    this.inputState = _.reduce(
      GamepadInput,
      (accumulator, input: GamepadInput) => {
        accumulator[input] = { duration: 0, isDown: false };
        return accumulator;
      },
      {}
    ) as GamepadInfo;
  }

  public get inputs(): GamepadInfo {
    return _.reduce(
      this.inputState,
      (accumulator, value, key) => {
        accumulator[key] = { ...value };
        return accumulator;
      },
      {}
    ) as GamepadInfo;
  }
}

export const GPR = new GamepadReader();
