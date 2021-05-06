import useDimensions from './DimensionsProvider';

const ResponsiveLayout = ({breakpoint = 414, renderMobile, renderDesktop}) => {
  const {width} = useDimensions();
  return width > breakpoint ? renderDesktop() : renderMobile();
};

export default ResponsiveLayout;
