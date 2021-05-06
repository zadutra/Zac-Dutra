import React from 'react';
import ResponsiveLayout from './ResponsiveLayout';
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const Content = ({children}) => {
  return (
    <ResponsiveLayout renderDesktop = {() => (
      <DesktopView>
        {children}
      </DesktopView>
    )}
    renderMobile = {() => (
      <MobileView>
        {children}
      </MobileView>
    )}
    />
  );
};

export default Content;
