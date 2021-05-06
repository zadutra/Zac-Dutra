import React, {useState} from 'react';

const MobileView = ({children}) => {
  const [active, setActive] = useState(0);
  return (
    <div className = 'tabs'>
      {children.map(({title}, idx) => (
        <button className = {idx === active ? 'active' : ''} key = {idx}
          onClick={() => setActive(idx)}>
          {children[idx].props.children[0].props.text}
        </button>
      ))}
      <div>
        {children[active].props.children[1]}
      </div>
    </div>
  );
};

export default MobileView;
