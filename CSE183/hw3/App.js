import React from 'react';

/**
 * Simple component with no state.
 *
 * @param {function} setDummy set the dummy state
 */
export function getMail(setMail) {
  fetch('http://localhost:3010/v0/mail')
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setMail(json.message);
      })
      .catch((error) => {
        setMail(error.toString());
      });
}

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  const [mail, setMail] = React.useState('');
  return (
    <div>
      <h3 id='instruction'>
        Click button to connect to the Backend dummy endpoint</h3>
      <button
        onClick={(event) => {
          getMail(setMail);
        }}
      >
      </button>
      <p/>
      <label>{mail}</label>
    </div>
  );
}

export default App;
