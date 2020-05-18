import * as React from "react";
import { ButtonLayout } from "src/components/buttonLayout";
import { GamepadInput } from "src/gamepad";
import { keyMap } from "src/keys";
import "src/components/controllerDisplay/styles.scss";

interface ControllerDisplayProps {
  direction: number;
  downKeys: GamepadInput[];
}

export class ControllerDisplay extends React.PureComponent<ControllerDisplayProps> {
  public render(): React.ReactNode {
    return (
      <div className="cn--controller-display">
        <this.ButtonLayoutComponent gamepadInput={GamepadInput.Y} />
        <div className="controller-display--row">
          <this.ButtonLayoutComponent gamepadInput={GamepadInput.X} />
          <this.ButtonLayoutComponent gamepadInput={GamepadInput.B} />
        </div>
        <this.ButtonLayoutComponent gamepadInput={GamepadInput.A} />
      </div>
    );
  }

  private ButtonLayoutComponent = (props: { gamepadInput: GamepadInput; }) => (
    <ButtonLayout
      keys={keyMap[props.gamepadInput]!}
      direction={this.props.direction}
      isDown={this.props.downKeys.includes(props.gamepadInput)}
    />
  );
}
