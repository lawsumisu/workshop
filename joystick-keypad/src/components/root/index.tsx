import * as React from 'react';
import { ControllerDisplay } from 'src/components/controllerDisplay';
import 'src/components/root/styles.scss';
import { KeyAction } from 'src/keys';

export class Root extends React.PureComponent {
  public state = {
    text: '',
    direction: 0,
    downKeys: [],
  };

  private ref: HTMLInputElement | null;

  public componentDidMount(): void {
    window.addEventListener('gamepadKeyPress', this.gamepadKeyPressListener);
    window.addEventListener('gamepadDirection', this.gamepadDirectionListener);
    window.addEventListener('gamepadKeyDown', this.gamepadKeyDownListener);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('gamepadKeyPress', this.gamepadKeyPressListener);
    window.removeEventListener('gamepadDirection', this.gamepadDirectionListener);
    window.removeEventListener('gamepadKeyDown', this.gamepadKeyDownListener);
  }

  public render(): React.ReactNode {
    return (
      <div className="cn--root">
        <input ref={this.onRef} value={this.state.text} onChange={this.onChange} />
        <ControllerDisplay direction={this.state.direction} downKeys={this.state.downKeys} />
      </div>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      text: e.target.value,
    });
  };

  private onRef = (ref: HTMLInputElement | null): void => {
    this.ref = ref;
  };

  private gamepadKeyPressListener = (e: CustomEvent) => {
    if (this.ref && this.ref === document.activeElement) {
      let { text } = this.state;
      let selectionStart = this.ref.selectionStart || 0;
      let precursorText = text.slice(0, selectionStart);
      let postcursorText = text.slice(selectionStart);
      switch (e.detail) {
        case KeyAction.ENTER:
          precursorText += ' ';
          break;
        case KeyAction.BACKSPACE:
          precursorText = precursorText.substring(0, precursorText.length - 1);
          break;
        case KeyAction.DELETE:
          postcursorText = postcursorText.substring(1);
          break;
        default:
          precursorText += e.detail;
          break;
      }
      this.setState({
        text: precursorText + postcursorText,
      }, () => {
        if (this.ref) {
          const i = e.detail === KeyAction.BACKSPACE ? -1 : (e.detail === KeyAction.DELETE ? 0 : 1);
          this.ref.selectionStart = selectionStart + i;
          this.ref.selectionEnd = this.ref.selectionStart;
        }
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
  };
}
