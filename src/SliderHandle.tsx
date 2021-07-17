import React, { useImperativeHandle, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
type SliderHandleProps = {
    style?: StyleProp<ViewStyle>;
    onPress?: (index: number) => void;
    children?: React.ReactNode;
};
const SliderHandle = ({ style }: SliderHandleProps) => {
    return (
        <View
            style={[
                {
                    borderRadius: 10,
                    height: 20,
                    width: 20,
                    backgroundColor: 'black',
                },
                style,
            ]}
        />
    );
};
export default SliderHandle;
