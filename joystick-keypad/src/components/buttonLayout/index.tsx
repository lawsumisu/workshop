import * as React from "react";
import * as _ from "lodash";
import cx from "classnames";
import "src/components/buttonLayout/styles.scss";

interface ButtonLayoutProps {
  keys: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ];
  direction: number;
  isDown: boolean;
}

interface ButtonLayoutState {
  radius: number;
}

function interpolate(start: number, stop: number, t: number): number {
  return start * (1 - t) + stop * t;
}

interface KeyProps {
  text: string;
  isHovered: boolean;
  isSelected: boolean;
  className?: string;
  style?: React.CSSProperties;
}

class Key extends React.PureComponent<KeyProps> {
  public render(): React.ReactNode {
    return (
      <div
        className={cx(
          "button-layout--key",
          this.props.isHovered && "mod--hovered",
          this.props.isSelected && this.props.isHovered && "mod-selected",
          this.props.className
        )}
        style={this.props.style}
      >
        {this.props.text}
      </div>
    );
  }
}
export class ButtonLayout extends React.PureComponent<
  ButtonLayoutProps,
  ButtonLayoutState
> {
  public state = {
    radius: 1,
  };

  private ref: HTMLDivElement | null;

  public render(): React.ReactNode {
    const { radius } = this.state;
    const { keys, direction, isDown } = this.props;
    const orderedKeyIndices = [0, 1, 2, 5, 8, 7, 6, 3];
    return (
      <div ref={this.onRef} className="cn--button-layout">
        <Key text={keys[4]} isHovered={direction === 4} isSelected={isDown}/>
        {_.map(orderedKeyIndices, (i: number, index) => {
          const t = index / orderedKeyIndices.length;
          const angleStart = (3 / 4) * Math.PI;
          const theta = interpolate(angleStart, angleStart - Math.PI * 2, t);
          const style = {
            transform: `rotate(${theta}rad) translate(${radius}px) rotate(${-theta}rad)`,
          };
          return (
            <Key
              className="mod--ring"
              key={index}
              style={style}
              text={keys[i]}
              isHovered={i === direction}
              isSelected={isDown}
            />
          );
        })}
      </div>
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
