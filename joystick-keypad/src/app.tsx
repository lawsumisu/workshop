import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GPR } from 'src/gamepad';
import { updateKeys } from 'src/keys';
import { Root } from 'src/components/root';

function performUpdate() {
  GPR.update();
  updateKeys();
  window.requestAnimationFrame(performUpdate)
}
window.requestAnimationFrame(performUpdate);

class App extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <Root/>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));