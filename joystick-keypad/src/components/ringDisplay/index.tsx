import * as React from "react";
import * as _ from "lodash";
import cx from "classnames";
import 'src/components/ringDisplay/styles.scss';

interface RingDisplayProps {
  center?: number;
  startTheta: number;
  clockwise: boolean;
  radius: number;
  className?: string;
  children: React.ReactNodeArray;
  forwardedRef? : React.Ref<any>
}

function interpolate(start: number, stop: number, t: number): number {
  return start * (1 - t) + stop * t;
}

export class RingDisplay extends React.PureComponent<RingDisplayProps> {
  public static defaultProps = {
    startTheta: 0,
    clockwise: false,
  };

  public render(): React.ReactNode {
    const { center, startTheta, radius, className, children, clockwise, forwardedRef } = this.props;
    const ringChildren = children.filter(
      (__, index: number) => index !== center
    );
    return (
      <div ref={forwardedRef} className={cx("cn--ring-display", className)}>
        {!_.isNil(center) && children[center]}
        {_.map(ringChildren, (child: React.ReactNode, index: number) => {
          const t = index / ringChildren.length;
          const d = clockwise ? -1 : 1;
          const theta = interpolate(startTheta, startTheta + Math.PI * 2 * d, t);
          const style = {
            transform: `rotate(${theta}rad) translate(${radius}px) rotate(${-theta}rad)`,
          };
          return (
            <div style={style} className="ring-display--elem" key={index}>
              {child}
            </div>
          );
        })}
      </div>
    );
  }
}
