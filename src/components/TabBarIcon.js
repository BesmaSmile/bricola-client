import React from 'react';
import Icon from './Icon';

const TabBarIcon = props => {
  return (
    <Icon
      viewBox="0 0 32 32"
      width="30px"
      height="30px"
      name={props.name}
      fill={props.color}
    />
  );
};

export default TabBarIcon;
