import * as React from 'react';
import * as _ from 'lodash';
import cx from 'classnames';
import { GamepadInput } from 'src/gamepad';
import 'src/components/buttonLayout/styles.scss';
import { RingDisplay } from 'src/components/ringDisplay';

export interface ButtonLayoutProps {
  keys: {
    [GamepadInput.A]: string;
    [GamepadInput.B]: string;
    [GamepadInput.X]: string;
    [GamepadInput.Y]: string;
    [GamepadInput.R1]?: string;
  };
  downKeys: GamepadInput[];
  isFocused?: boolean;
}

interface ButtonLayoutState {
  radius: number;
}

interface KeyProps {
  text: string;
  isHovered: boolean;
  isSelected?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type: 'face' | 'shoulder';
}

class Key extends React.PureComponent<KeyProps> {
  public static defaultProps = {
    type: 'face',
  };

  public render(): React.ReactNode {
    return (
      <div
        className={cx(
          'button-layout--key',
          `mod--${this.props.type}`,
          this.props.isHovered && 'mod--hovered',
          this.props.isSelected && this.props.isHovered && 'mod--selected',
          this.props.className
        )}
        style={this.props.style}
      >
        {this.props.text}
      </div>
    );
  }
}
export class ButtonLayout extends React.PureComponent<ButtonLayoutProps, ButtonLayoutState> {
  public state = {
    radius: 1,
  };

  private ref: HTMLDivElement | null;

  public render(): React.ReactNode {
    const { radius } = this.state;
    const { keys, isFocused = false, downKeys } = this.props;
    const orderedKeys = [GamepadInput.X, GamepadInput.Y, GamepadInput.B, GamepadInput.A, GamepadInput.R1];
    return (
      <RingDisplay
        forwardedRef={this.onRef}
        className="cn--button-layout"
        radius={radius}
        startTheta={Math.PI}
        center={4}
      >
        {orderedKeys
          .map((k: GamepadInput, index) => {
            return (
              <Key
                key={index}
                text={keys[k]}
                isHovered={isFocused}
                isSelected={downKeys.includes(k)}
                type={k === GamepadInput.R1 ? 'shoulder' : 'face'}
              />
            );
          })}
      </RingDisplay>
    );
  }

  private onRef = (ref: HTMLDivElement | null): void => {
    this.ref = ref;
    if (this.ref) {
      this.setState({
        radius: this.ref.clientWidth / 2,
      });
    }
  };
}
