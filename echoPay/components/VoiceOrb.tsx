import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withDelay,
    Easing,
} from 'react-native-reanimated'

interface VoiceOrbProps {
    mode: 'listening' | 'speaking' | 'idle' | 'processing' | 'transcribing'
    size?: number
    color?: string
}

const VoiceOrb = ({ mode, size = 60, color = '#000000' }: VoiceOrbProps) => {
    // Only bars for listening - no complex animations
    const bar1 = useSharedValue(6)
    const bar2 = useSharedValue(6)
    const bar3 = useSharedValue(6)
    const bar4 = useSharedValue(6)
    const bar5 = useSharedValue(6)

    // Simple bar style
    const createBarStyle = (height: any) =>
        useAnimatedStyle(() => ({
            height: height.value,
            width: 6,
            backgroundColor: color,
            borderRadius: 3,
        }))

    const barStyle1 = createBarStyle(bar1)
    const barStyle2 = createBarStyle(bar2)
    const barStyle3 = createBarStyle(bar3)
    const barStyle4 = createBarStyle(bar4)
    const barStyle5 = createBarStyle(bar5)

    useEffect(() => {
        // Stop all animations first
        bar1.value = withTiming(6, { duration: 100 })
        bar2.value = withTiming(6, { duration: 100 })
        bar3.value = withTiming(6, { duration: 100 })
        bar4.value = withTiming(6, { duration: 100 })
        bar5.value = withTiming(6, { duration: 100 })

        if (mode === 'listening') {
            // Simple up and down bars for listening only
            setTimeout(() => {
                bar1.value = withRepeat(
                    withTiming(20, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                    -1,
                    true
                )
                bar2.value = withDelay(
                    80,
                    withRepeat(
                        withTiming(25, { duration: 450, easing: Easing.inOut(Easing.ease) }),
                        -1,
                        true
                    )
                )
                bar3.value = withDelay(
                    160,
                    withRepeat(
                        withTiming(30, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                        -1,
                        true
                    )
                )
                bar4.value = withDelay(
                    240,
                    withRepeat(
                        withTiming(22, { duration: 420, easing: Easing.inOut(Easing.ease) }),
                        -1,
                        true
                    )
                )
                bar5.value = withDelay(
                    120,
                    withRepeat(
                        withTiming(18, { duration: 380, easing: Easing.inOut(Easing.ease) }),
                        -1,
                        true
                    )
                )
            }, 150)
        }
        // For 'speaking' and 'idle' modes, bars stay at minimum height (no animation)
    }, [mode])

    // Only show bars when listening
    if (mode !== 'listening') {
        return null
    }

    return (
        <View style={styles.container}>
            <View style={styles.barsContainer}>
                <Animated.View style={barStyle1} />
                <Animated.View style={barStyle2} />
                <Animated.View style={barStyle3} />
                <Animated.View style={barStyle4} />
                <Animated.View style={barStyle5} />
                <Animated.View style={barStyle4} />
                <Animated.View style={barStyle3} />
                <Animated.View style={barStyle2} />
                <Animated.View style={barStyle1} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 60,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 40,
        width: '100%',
    }
})

export default VoiceOrb