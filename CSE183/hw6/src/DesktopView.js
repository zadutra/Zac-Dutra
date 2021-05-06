import React from 'react';
import useDimenions from './DimensionsProvider';

const DesktopView = ({children}) => {
  const {width} = useDimenions();
  return (
    <div className = {'desktop' + (width > 414 && width < 1024?
    'vertical' : 'horizontal')}>
      {children}
    </div>
  );
};

export default DesktopView;
