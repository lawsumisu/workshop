import * as React from 'react';
import { ControllerDisplay } from 'src/components/controllerDisplay';
import 'src/components/root/styles.scss';

export class Root extends React.PureComponent {
  public state = {
    text: '',
    direction: 0,
    downKeys: [],
  };

  private ref: HTMLInputElement | null;

  public componentDidMount(): void {
    window.addEventListener('gamepadKeyPress', this.listener);
    window.addEventListener('gamepadDirection', this.gamepadDirectionListener);
    window.addEventListener('gamepadKeyDown', this.gamepadKeyDownListener);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('gamepadKeyPress', this.listener);
    window.removeEventListener('gamepadDirection', this.gamepadDirectionListener);
    window.removeEventListener('gamepadKeyDown', this.gamepadKeyDownListener);
  }

  public render(): React.ReactNode {
    return (
      <div className="cn--root">
        <input ref={this.onRef} value={this.state.text} onChange={this.onChange} />
        <ControllerDisplay direction={this.state.direction} downKeys={this.state.downKeys}/>
      </div>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      text: e.target.value
    })
  };

  private onRef = (ref: HTMLInputElement | null): void => {
    this.ref = ref;
  };

  private listener = (e: CustomEvent) => {
    if (this.ref === document.activeElement) {
      this.setState({
        text: this.state.text + e.detail,
      });
    }
  };

  private gamepadDirectionListener = (e: CustomEvent) => {
    this.setState({
      direction: e.detail,
    });
  };

  private gamepadKeyDownListener = (e: CustomEvent) => {
    this.setState({
      downKeys: e.detail,
    });
  }
}