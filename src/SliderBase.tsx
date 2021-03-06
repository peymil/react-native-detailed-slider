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
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useAnimatedReaction,
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
    // value,
    children,
    offsets,
    closeness,
}: SliderBaseProps) => {
    const [value, setValue] = useState(0);
    const [valueGroup, setValueGroup] = useState<number[]>([]);
    const [containerLayout, setContainerLayout] = useState({
        x: 0,
        y: 0,
        height: 0,
        width: 0,
    });
    const previousTouchDistance = useRef(0);
    const slider = useSharedValue(0);
    const previousSlider = useSharedValue(0);
    const sliderHeight = useSharedValue(5);
    const [isSwipedUp, setIsSwipedUp] = useState(false);
    const [currentHovering, setCurrentHovering] = useState(-1);
    const [popupLayout, setPopupLayout] = useState([]);
    const findCloseValues = useCallback((currentValue: number) => {
        const currentPoint = pointLocations[currentValue];
        const closePoints = [currentPoint];
        for (let index = 1; index > pointLocations.length / 2; index++) {
            const previousPoint = pointLocations[currentValue - index];
            const nextPoint = pointLocations[currentValue + index];
            const nextPointDist = nextPoint - currentPoint;
            const previousPointDist = currentPoint - previousPoint;
            const isNextPointClose = closeness > nextPointDist;
            const isPreviousPointClose = closeness > previousPointDist;
            if (isNextPointClose) closePoints.push(nextPoint);
            if (isPreviousPointClose) closePoints.unshift(previousPoint);
            if (!isPreviousPointClose && !isNextPointClose) {
                return closePoints;
            }
        }
        return closePoints;
    }, []);
    // const handler = useAnimatedGestureHandler(
    //     {
    //         onStart: (event, context) => {
    //         },
    //         onActive: (event, context) => {},
    //         onEnd: (event, context) => {},
    //     },
    //     []
    // );
    const pointLocations = useMemo(() => {
        const offsetsSum = offsets.reduce((pre, curr) => pre + curr);
        const pointLocations = offsets.map(
            (offset) => containerLayout.width * (offset / offsetsSum)
        );
        //for start
        // let arrangedPointLocations = [];
        // let currentClosePoints: Array<number> = [];
        // let index = 0;
        // for (let pointLocation of pointLocations) {
        //     const previousPointLocation = pointLocations[index - 1];
        // if (
        //     closeness >
        //     (previousPointLocation || currentClosePoints[0]) - pointLocation
        // ) {
        //         currentClosePoints.push(pointLocation);
        //     } else {
        //         if (currentClosePoints[0]) {
        //             arrangedPointLocations.push(currentClosePoints);
        //             currentClosePoints = [];
        //         } else arrangedPointLocations.push(pointLocation);
        //     }
        //     index++;
        // }
        return pointLocations;
        //for end
    }, [containerLayout]);

    const panHandler = useAnimatedGestureHandler(
        {
            onStart: (event, context) => {
                // slider.value = event.absoluteX - containerLayout.x;
                // previousSlider.value = slider.value;
            },
            onActive: (event, context) => {
                sliderHeight.value = event.x;
                const previousOffset = pointLocations[value - 1];
                const currentOffset = pointLocations[value];
                const nextOffset = pointLocations[value + 1];
                const closeValues = findCloseValues(value);
                if (sliderHeight.value > nextOffset) {
                    runOnJS(setValue)(value + 1);
                } else if (sliderHeight.value < previousOffset) {
                    runOnJS(setValue)(value - 1);
                }
                if (
                    event.y > containerLayout.height * 2 &&
                    closeValues.length > 1
                ) {
                    if (valueGroup.length < 1)
                        runOnJS(setValueGroup)(closeValues);
                }
            },
            onEnd: (event, context) => {
                if (valueGroup) runOnJS(setValueGroup)([]);
            },
        },
        []
    );
    const sliderAnimatedStyle = useAnimatedStyle(
        () => ({
            transform: [
                { translateX: slider.value, scaleY: sliderHeight.value },
            ],
        }),
        []
    );

    const findInNestedArray = useCallback((index) => {
        let i = 0;
        for (let elem of pointLocations) {
            if (Array.isArray(elem))
                for (let elem of pointLocations) {
                    i++;
                    if (i === index) return elem;
                }
            else {
                i++;
                if (i === index) return elem;
            }
            return 0;
        }
    }, []);
    return (
        <PanGestureHandler onHandlerStateChange={panHandler}>
            <Animated.View
                style={[sliderAnimatedStyle]}
                onLayout={({ nativeEvent: { layout } }) => {
                    setContainerLayout(layout);
                }}
            >
                {isSwipedUp ? (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            width: '100%',
                            left: slider.value,
                        }}
                    >
                        {valueGroup.map(() => {
                            <View
                                isHovering={true}
                                onLayout={() => {
                                    popupLayout.push();
                                    if (
                                        popupLayout.length === valueGroup.length
                                    )
                                        setPopupLayout(popupLayout);
                                }}
                            ></View>;
                        })}
                    </View>
                ) : null}
                {pointLocations.map((offset) => {
                    if (Array.isArray(offset)) offset.map(() => <Point />);
                    else return <Point />;
                })}
                {children}
            </Animated.View>
        </PanGestureHandler>
    );
};
export default SliderBase;
