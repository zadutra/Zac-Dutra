import React from 'react';
import Picker from './Picker';
/**
 * Simple component with no state.
 *
 * See the basic-react from lecture 11 for an example of adding and
 * reacting to changes in state.
 */
class App extends React.Component {
  /**
   * @return {object} a <div> containing an <h2>
   */
  render() {
    return (
      <div id = "Picker">
        <Picker/>
      </div>
    );
  }
}

export default App;
