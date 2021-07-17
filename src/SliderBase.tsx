import React, {
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { PanResponder, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
type SliderBaseProps = {
    style?: number;
    children?: React.ReactNode;
    closeness: number;
    value: number;
    offsets: number[];
};
const SliderBase = ({
    style,
    value,
    children,
    offsets,
    closeness,
}: SliderBaseProps) => {
    const [value, setValue] = useState(value);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const previousTouchDistance = useRef(0);
    const slider = useSharedValue(0);
    const previousSlider = useSharedValue(0);
    const sliderHeight = useSharedValue(5);
    const [isSwipedUp, setIsSwipedUp] = useState(false);
    const pan = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            previousSlider.value = gestureState.dy;
            setIsSwipedUp(false);
        },
        onPanResponderMove: (evt, gestureState) => {
            sliderHeight.value = previousSlider.value + gestureState.dy;
            if (gestureState.dy > containerHeight * 2) {
                setIsSwipedUp(true);
            }
        },
    });
    const sliderAnimatedStyle = useAnimatedStyle(
        () => ({
            transform: [
                { translateX: slider.value, scaleY: sliderHeight.value },
            ],
        }),
        []
    );
    const pointLocations = useMemo(() => {
        const offsetsSum = offsets.reduce((pre, curr) => pre + curr);
        const pointLocations = offsets.map(
            (offset) => containerWidth * (offset / offsetsSum)
        );
        //for start
        let arrangedPointLocations = [];
        let currentClosePoints: Array<number> = [];
        let index = 0;
        for (let pointLocation of pointLocations) {
            const previousPointLocation = pointLocations[index - 1];
            if (
                closeness >
                (previousPointLocation || currentClosePoints[0]) - pointLocation
            ) {
                currentClosePoints.push(pointLocation);
            } else {
                if (currentClosePoints[0]) {
                    arrangedPointLocations.push(currentClosePoints);

                    currentClosePoints = [];
                } else arrangedPointLocations.push(pointLocation);
            }
            index++;
        }
        return arrangedPointLocations;
        //for end
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
        <PanGestureHandler>
            <Animated.View
                style={[sliderAnimatedStyle]}
                onLayout={({ nativeEvent }) => {
                    setContainerWidth(nativeEvent.layout.width);
                    setContainerHeight(nativeEvent.layout.height);
                }}
            >
                {isSwipedUp ? (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: slider.value,
                        }}
                    />
                ) : null}
                {pointLocations.map((offset) => {
                    if (Array.isArray(offset)) return <NestedPoints />;
                    else return <Point />;
                })}
                {children}
            </Animated.View>
        </PanGestureHandler>
    );
};
export default SliderBase;
