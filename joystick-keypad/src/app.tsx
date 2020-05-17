import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <div>
        <input/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));