declare module 'react-native-image-slider' {
  import { Component } from 'react';
  import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

  interface ImageSliderProps {
    images: string[] | ImageSourcePropType[];
    customSlide?: (props: any) => JSX.Element;
    customButtons?: (position: number, move: (index: number) => void) => JSX.Element;
    style?: StyleProp<ViewStyle>;
    autoPlayWithInterval?: number;
    loop?: boolean;
    onPositionChanged?: (position: number) => void;
  }

  export default class ImageSlider extends Component<ImageSliderProps> {}
}
