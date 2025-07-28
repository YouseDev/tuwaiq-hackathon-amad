```tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withDelay,
    interpolate,
    Easing,
} from "react-native-reanimated"
import { Feather } from "@expo/vector-icons"

// total duration of one wave cycle
const WAVE_DURATION = 2000
// stagger delay between each wave
const WAVE_DELAY = WAVE_DURATION / 3

export default function RecitationButton2() {
    const wave1 = useSharedValue(0)
    const wave2 = useSharedValue(0)
    const wave3 = useSharedValue(0)

    // kick off three looping waves, staggered
    wave1.value = withRepeat(
        withTiming(1, {
            duration: WAVE_DURATION,
            easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
    )
    wave2.value = withDelay(
        WAVE_DELAY,
        withRepeat(
            withTiming(1, {
                duration: WAVE_DURATION,
                easing: Easing.out(Easing.ease),
            }),
            -1,
            false,
        ),
    )
    wave3.value = withDelay(
        2 * WAVE_DELAY,
        withRepeat(
            withTiming(1, {
                duration: WAVE_DURATION,
                easing: Easing.out(Easing.ease),
            }),
            -1,
            false,
        ),
    )

    // filled‑circle style: starts at scale 1 (button size), grows to 3×
    const makeWaveStyle = (progress: Animated.SharedValue<number>) =>
        useAnimatedStyle(() => ({
            ...StyleSheet.absoluteFillObject,
            borderRadius: 9999,
            backgroundColor: "rgba(180, 201, 64, 0.5)", // semi‑transparent fill
            transform: [
                {
                    scale: interpolate(progress.value, [0, 1], [1, 3]),
                },
            ],
            opacity: interpolate(progress.value, [0, 0.7, 1], [0.6, 0, 0]),
        }))

    const style1 = makeWaveStyle(wave1)
    const style2 = makeWaveStyle(wave2)
    const style3 = makeWaveStyle(wave3)

    return (
        <View style={styles.center}>
            <View style={styles.wrapper}>
                <Animated.View style={style1} />
                <Animated.View style={style2} />
                <Animated.View style={style3} />

                <View style={styles.button}>
                    <Feather name="play" size={42} color="black" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    wrapper: {
        width: 128,
        height: 128,
        overflow: "visible", // allow circles to grow beyond container
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: 128,
        height: 128,
        borderRadius: 9999,
        backgroundColor: "rgba(184, 193, 29, 1.0)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // keep the play icon on top
    },
})
```
