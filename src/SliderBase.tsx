import React, {
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import { View } from 'react-native';
type SliderBaseProps = {
    style?: number;
    children?: React.ReactNode;
    closeness: number;
    offsets: number[];
};
const SliderBase = ({
    style,
    children,
    offsets,
    closeness,
}: SliderBaseProps) => {
    const [containerWidth, setContainerWidth] = useState(0);

    const pointLocations = useMemo(() => {
        const offsetsSum = offsets.reduce((pre, curr) => pre + curr);
        const pointLocations = offsets.map(
            (offset) => containerWidth * (offset / offsetsSum)
        );
        //for loop
        let arrangedPointLocations = [];
        let currentClosePoints = [];
        let index = 0;
        for (let pointLocation of pointLocations) {
            const previousPointLocation = pointLocations[index - 1];
            if (closeness > pointLocation - previousPointLocation) {
                currentClosePoints.push(pointLocation);
            }
            {
                arrangedPointLocations.push(currentClosePoints);
                currentClosePoints = [];
            }

            index++;
        }
        return arrangedPointLocations;
        //for end
        containerWidth;
    }, [containerWidth]);
    const findInNestedArray = useCallback((index) => {
        let i = 0;
        for (let elem of pointLocations) {
            if (Array.isArray(elem))
                for (let elem of pointLocations) {
                    i++;
                }
            else i++;
        }
    }, []);
    return (
        <View
            onLayout={({ nativeEvent }) => {
                setContainerWidth(nativeEvent.layout.width);
            }}
        >
            {children}
        </View>
    );
};
export default SliderBase;
