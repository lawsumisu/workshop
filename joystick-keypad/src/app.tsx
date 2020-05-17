import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GPR } from 'src/gamepad';
import { updateKeys } from 'src/keys';

function performUpdate() {
  GPR.update();
  updateKeys();
  window.requestAnimationFrame(performUpdate)
}
window.requestAnimationFrame(performUpdate);

class App extends React.Component {
  public state = {
    text: ''
  };

  private ref: HTMLInputElement | null;

  public componentDidMount(): void {
    window.addEventListener('gamepadKeyPress', this.listener)
  }

  public componentWillUnmount(): void {
    window.removeEventListener('gamepadKeyPress', this.listener);
  }

  public render(): React.ReactNode {
    return (
      <div>
        <input ref={this.onRef} value={this.state.text} onChange={this.onChange} />
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
  }

}

ReactDOM.render(<App />, document.getElementById('root'));