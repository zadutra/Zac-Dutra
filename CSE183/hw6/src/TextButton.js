import React from 'react';
import TextContext from './TextContext';

/**
 * @return {object}
 */
function TextButton() {
  return (
    <TextContext.Consumer>
      {({text, changeText}) => (
        <button onClick={changeText}>{text}</button>
      )}
    </TextContext.Consumer>
  );
}

export default TextButton;
