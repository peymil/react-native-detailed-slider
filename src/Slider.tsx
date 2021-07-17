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
        const [currentValue, setCurrentValue] = useState(initialValue);
        useImperativeHandle(ref, () => ({
            changeValue: (index) => {
                setCurrentValue(index);
            },
            openSensitiveSlider: () => {},
        }));
        return (
            <SliderBase
                value={value}
                onClick={(value) => {
                    setCurrentValue(value);
                }}
            >
                {children || <SliderHandle />}
            </SliderBase>
        );
    }
);
export default Slider;
