import * as React from 'react';
import { ButtonLayout, ButtonLayoutProps } from 'src/components/buttonLayout';
import { GamepadInput } from 'src/gamepad';
import { keyMap } from 'src/keys';
import 'src/components/controllerDisplay/styles.scss';
import { RingDisplay } from 'src/components/ringDisplay';

interface ControllerDisplayProps {
  direction: number;
  downKeys: GamepadInput[];
}

export class ControllerDisplay extends React.PureComponent<ControllerDisplayProps> {
  public render(): React.ReactNode {
    const orderedIndices = [0, 1, 2, 5, 8, 7, 6, 3, 4];
    return (
      <RingDisplay className="cn--controller-display" radius={90} startTheta={3/4 * Math.PI} clockwise={true} center={8}>
        { orderedIndices.map((i: number) => {
          const keys = [GamepadInput.A, GamepadInput.B, GamepadInput.X, GamepadInput.Y, GamepadInput.R1].reduce((output, k) => {
            output[k] = keyMap[k]![i];
            return output;
          }, {} as ButtonLayoutProps['keys']);
          return (
            <ButtonLayout key={i} keys={keys} isFocused={i === this.props.direction} downKeys={{}}/>
          )
        })}
      </RingDisplay>
    );
  }
}
