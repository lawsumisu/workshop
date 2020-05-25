import * as React from 'react';
import * as _ from 'lodash';
import { ControllerDisplay } from 'src/components/controllerDisplay';
import 'src/components/root/styles.scss';
import { GPKeyEvent, KeyAction } from 'src/keys';
import { GamepadInput } from 'src/gamepad';

interface RootState {
  text: string;
  direction: number;
  downKeys: GamepadInput[],
}

export class Root extends React.PureComponent<{}, RootState> {
  public state = {
    text: '',
    direction: 0,
    downKeys: [],
  };

  private ref: HTMLInputElement | null;
  private cursorIndex = 0;
  private isHighlightLeft = false;

  public componentDidMount(): void {
    window.addEventListener(GPKeyEvent.INSERT_KEY_PRESS, this.gamepadKeyPressListener);
    window.addEventListener('gamepadDirection', this.gamepadDirectionListener);
    window.addEventListener('gamepadKeyDown', this.gamepadKeyDownListener);
    window.addEventListener(GPKeyEvent.SELECT_KEY_DIRECTION, this.selectDirectionListener);
    this.ref && this.ref.focus();
  }

  public componentWillUnmount(): void {
    window.removeEventListener(GPKeyEvent.INSERT_KEY_PRESS, this.gamepadKeyPressListener);
    window.removeEventListener('gamepadDirection', this.gamepadDirectionListener);
    window.removeEventListener('gamepadKeyDown', this.gamepadKeyDownListener);
    window.removeEventListener(GPKeyEvent.SELECT_KEY_DIRECTION, this.selectDirectionListener);
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
      const selectionStart = this.ref.selectionStart || 0;
      const selectionEnd = _.isNumber(this.ref.selectionEnd) ? this.ref.selectionEnd : this.state.text.length;
      const hasActiveSelection = selectionStart < selectionEnd;
      let precursorText = text.slice(0, selectionStart);
      let postcursorText = text.slice(selectionEnd);
      switch (e.detail) {
        case KeyAction.ENTER:
          precursorText += ' ';
          break;
        case KeyAction.BACKSPACE: {
          if (!hasActiveSelection) {
            precursorText = precursorText.substring(0, precursorText.length - 1);
          }
          break;
        }
        case KeyAction.DELETE: {
          if (!hasActiveSelection) {
            postcursorText = postcursorText.substring(1);
          }
          break;
        }
        default:
          precursorText += e.detail;
          break;
      }
      this.setState({
        text: precursorText + postcursorText,
      }, () => {
        if (this.ref) {
          let i = 0;
          if (!hasActiveSelection) {
            i = e.detail === KeyAction.BACKSPACE ? -1 : (e.detail === KeyAction.DELETE ? 0 : 1);
          }
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

  private selectDirectionListener = (e: CustomEvent<{ key: GamepadInput; isActiveSelection: boolean}>) => {
    if (this.ref) {
      const selectionStart = this.ref.selectionStart || 0;
      const selectionEnd = this.ref.selectionEnd || this.state.text.length;
      if (selectionStart === selectionEnd) {
        this.cursorIndex = selectionStart;
      }
      switch(e.detail.key) {
        case GamepadInput.LEFT: {
          this.cursorIndex = Math.max(0, this.cursorIndex - 1);
          break;
        }
        case GamepadInput.RIGHT: {
          this.cursorIndex = Math.min(this.state.text.length, this.cursorIndex + 1);
          break;
        }
      }
      if (this.cursorIndex > selectionEnd) {
        this.isHighlightLeft = false;
      } else if (this.cursorIndex < selectionStart) {
        this.isHighlightLeft = true;
      }
      if (e.detail.isActiveSelection) {
        this.ref.selectionStart = this.isHighlightLeft ? this.cursorIndex : selectionStart;
        this.ref.selectionEnd = this.isHighlightLeft ? selectionEnd : this.cursorIndex;
      } else {
        this.ref.selectionStart = this.cursorIndex;
        this.ref.selectionEnd = this.cursorIndex;
      }
    }
  }
}
