import React, { useImperativeHandle, useState } from 'react';
import SliderBase from './SliderBase';
import SliderHandle from './SliderHandle';
type SliderProps = {
    minValue: number;
    maxValue: number;
    step: number | number[];
    initialValue?: number;
    children?: React.ReactNode;
    onValueChange?: (value: number) => void;
};
type SliderRef = {
    changeValue: (value: number) => void;
    openSensitiveSlider: () => void;
};
const Slider = React.forwardRef(
    (
        {
            maxValue,
            initialValue,
            children,
            minValue,
            onValueChange,
            step,
        }: SliderProps,
        ref: React.Ref<SliderRef>
    ) => {
        const [value, setValue] = useState(initialValue);
        useImperativeHandle(ref, () => ({
            changeValue: (index) => {
                setValue(index);
            },
            openSensitiveSlider: () => {},
        }));
        return <SliderBase>{children || <SliderHandle />}</SliderBase>;
    }
);
export default Slider;
