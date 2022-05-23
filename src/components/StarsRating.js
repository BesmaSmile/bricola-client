import React from 'react';
import {Rating} from 'react-native-ratings';
import colors from 'src/constants/colors';

const StarsRating = props => {
  const {size, rating, backgroundColor, readonly, onRating} = props;
  return (
    <Rating
      type="custom"
      readonly={readonly}
      onFinishRating={onRating}
      ratingColor={colors.statGreenColor}
      ratingBackgroundColor={colors.grey}
      tintColor={backgroundColor}
      fractions={1}
      ratingCount={5}
      startingValue={rating}
      imageSize={size}
      showRating={false}
    />
  );
};

export default StarsRating;
