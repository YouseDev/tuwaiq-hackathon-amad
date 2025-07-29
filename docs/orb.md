AI Assistant Voice Animation in Expo (No Lottie Required)
Introduction
AI voice assistants often display a “listening” or “speaking” animation – for example, a pulsing orb or waveform – to indicate activity. We want to implement such an animation in a React Native Expo app without using Lottie and without tying it to real audio input/output events. This means the animation will be purely simulated (triggered by app state, not actual microphone data). We’ll explore how to achieve this using Expo-compatible tools like React Native Reanimated 2 and react-native-svg, and how to structure the solution as a reusable component.
Expo-Friendly Animation Tools
Expo supports several animation libraries that work without ejecting:
React Native Reanimated 2: A powerful, high-performance animation library that runs animations on the UI thread. It’s included in Expo SDK (just expo install react-native-reanimated) and works out-of-the-box with the Expo Babel preset
docs.expo.dev
. Reanimated 2 lets us use hooks like useSharedValue and useAnimatedStyle to create smooth looping animations.
React Native SVG: Allows rendering custom SVG graphics (circles, paths, etc.) in React Native. We can combine this with Reanimated to animate SVG shapes for more complex visuals (e.g. waveforms). Reanimated can animate SVG props by wrapping SVG components with Animated.createAnimatedComponent and using animated props
docs.swmansion.com
docs.swmansion.com
. This means we can smoothly change attributes like a circle’s radius or a path’s shape over time.
Moti (optional): A library built on Reanimated 2 that provides a simpler API for common animations. It works in Expo and can simplify code (e.g. one liner for looping transitions) by abstracting useAnimatedStyle and loops
medium.com
. We’ll mention how to use it as an alternative.
(Note: You could also use the built-in React Native Animated API or libraries like react-native-animatable, but Reanimated 2 offers more flexibility and smoother animations, so we’ll focus on that.)
Example 1: Pulsing Orb Animation (Listening Indicator)
One visually appealing pattern is a pulsing orb or ripple effect – a circle that expands and fades out, often repeated in waves. This can simulate the assistant “listening” or awaiting input. We’ll create a component that renders an animated circle (or multiple concentric circles) that continuously pulse. Steps to Implement a Pulsing Orb:
Create the Circle Element: Use a View (or an <Svg><Circle></Svg> element) styled as a circle. For example, set a fixed width/height and borderRadius to half the size to make it round. You might also position it centrally in its container.
Initialize Shared Values: Use Reanimated’s useSharedValue to define an animation progress value (e.g. from 0 to 1). This value will drive the animation. For a ripple effect with multiple circles, you can use an array of shared values (one per circle) or one shared value with staggered delays for each circle.
Define Animated Styles: Use useAnimatedStyle to map the shared value to the circle’s style. For a pulsing effect, you might map the value to scale and opacity. For example, scale the circle from 1x to 1.5x (or larger) and fade out opacity from 0.7 to 0 as the value goes 0→1
medium.com
. This gives the impression of a circle growing and fading.
Loop the Animation: In a useEffect, start the animation when the component mounts (or when the “active” prop is true). Use Reanimated’s withTiming to animate the shared value from 0 to 1 over a duration, and wrap it with withRepeat to loop indefinitely. You can also use withDelay to stagger multiple waves. For example, if you have 3 circles, start each one with an incremental delay (e.g. 0ms, 400ms, 800ms) so they pulse one after the other
medium.com
. Use an easing function (like Easing.out(Easing.ease)) for a smooth deceleration as the circle expands.
Render the Animated Circle(s): Apply the animated style to your circle Animated.View. If using multiple circles for a ripple effect, stack them using absolute positioning (so they overlap) and varying z-index or opacity. You can also include a static center dot for a nice touch (a small solid circle that doesn’t animate, representing the assistant’s “microphone”).
Below is an example of a PulsingOrb component implementing a triple-wave ripple. It uses three overlapping animated circles that expand and fade out in succession:
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
useSharedValue, useAnimatedStyle, withTiming, withRepeat, withDelay, Easing, interpolate
} from 'react-native-reanimated';

const PulsingOrb = () => {
// Three shared values for three waves
const progress1 = useSharedValue(0);
const progress2 = useSharedValue(0);
const progress3 = useSharedValue(0);

// Reusable animated style generator for a wave circle
const createWaveStyle = (progress) =>
useAnimatedStyle(() => {
return {
// interpolate the progress value to scale (1x to 4x size) and opacity (0.8 to 0)
transform: [{ scale: interpolate(progress.value, [0, 1], [1, 4]) }],
opacity: interpolate(progress.value, [0, 1], [0.8, 0])
};
});

const waveStyle1 = createWaveStyle(progress1);
const waveStyle2 = createWaveStyle(progress2);
const waveStyle3 = createWaveStyle(progress3);

// Start looping animations with staggered delays
useEffect(() => {
progress1.value = withRepeat(
withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
-1, // -1 for infinite
false // no reverse, restart from beginning each time
);
progress2.value = withDelay(400, withRepeat(
withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
-1,
false
));
progress3.value = withDelay(800, withRepeat(
withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
-1,
false
));
}, []); // empty dependency to run once on mount

return (
<View style={styles.container}>
{/_ Static center dot (optional) _/}
<View style={[styles.circle, styles.centerDot]} />
{/_ Three pulsing wave circles _/}
<Animated.View style={[styles.circle, waveStyle1]} />
<Animated.View style={[styles.circle, waveStyle2]} />
<Animated.View style={[styles.circle, waveStyle3]} />
</View>
);
};

const CIRCLE_SIZE = 100;
const styles = StyleSheet.create({
container: {
alignItems: 'center',
justifyContent: 'center'
},
circle: {
width: CIRCLE_SIZE,
height: CIRCLE_SIZE,
borderRadius: CIRCLE_SIZE / 2,
backgroundColor: '#4A90E2', // bluish color for the orb
position: 'absolute'
},
centerDot: {
width: 20,
height: 20,
borderRadius: 10,
backgroundColor: '#4A90E2'
}
});

export default PulsingOrb;
In this example, each Animated.View circle uses a shared value that goes from 0→1 in 2 seconds and repeats continuously. The useAnimatedStyle interpolates that value into a larger scale and lower opacity, creating a wave that expands and fades out. By offsetting the start of each wave with withDelay, the three circles pulse one after another, giving a continuous ripple effect
medium.com
. The static center dot makes it look like waves emanate from a source. Using Moti (Alternative): The same effect can be achieved with the Moti library in a more declarative way. Moti’s <View> from motify can animate from an initial state to an end state and loop automatically. For example, one of the wave circles above could be written with Moti as:
import { MotiView } from 'moti';

<MotiView  
 style={[styles.circle, StyleSheet.absoluteFill]}  
 from={{ opacity: 0.8, scale: 1 }} // start state  
 animate={{ opacity: 0, scale: 4 }} // end state  
 transition={{
    type: 'timing',
    duration: 2000,
    easing: Easing.out(Easing.ease),
    loop: true,
    delay: 400                // e.g. 400ms delay for the second wave
  }}
/>
Moti handles the useAnimatedStyle and loop logic under the hood. As shown above, you can specify loop: true along with timing duration and delay to stagger multiple waves
medium.com
. This can greatly simplify the code if you’re open to adding the Moti dependency.
Example 2: Waveform “Equalizer” Bars (Speaking Indicator)
Another common visualization is a waveform equalizer – a series of bars (or dots) that rise and fall, imitating audio levels. We can create a component with several small vertical bars that animate up and down continuously. This could represent the assistant “speaking” or just add a dynamic feel. Since we’re not using real audio data, we’ll animate the bars in a loop or with pseudo-random heights. Steps to Implement Waveform Bars:
Layout the Bars: Decide on the number of bars (say 4 or 5) and create a container (a View with flexDirection: 'row') to hold them. Each bar can be a View with a fixed width and a variable height. Give them some spacing (margin) for separation and maybe a rounded border radius for a pill shape.
Shared Values for Heights: Use useSharedValue for each bar’s height (or for a scaling factor). Initialize them to a “minimum” height (or scale). For example, bars might oscillate between a min height of 10 and a max height of 40.
Animated Styles for Bars: Use useAnimatedStyle for each bar to apply an animated height or a vertical scale transform. For instance, you can animate the height style directly based on the shared value. Ensure the container has a fixed height or align items to bottom so that bars grow upward visually.
Animate the Bars in a Loop: Similar to the orb, use withTiming and withRepeat to make each bar’s height transition up and down. To make it interesting, stagger the animations or use different durations so the bars aren’t in sync (this creates a more natural, “speaking” look). You can also introduce randomness by picking a new random height each cycle, but a simple periodic animation with different phase offsets can suffice. Use withRepeat(..., -1, true) with reverse=true so that each bar’s height goes up then down continuously without needing a separate down animation.
Trigger and Control: Start the bar animations on mount or when the “speaking” state is active. If you only want this when the assistant is speaking, you might conditionally render or start/stop the animation based on a prop.
Below is a simplified VoiceBars component with four bars that loop through an up-and-down animation out of phase:
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
useSharedValue, useAnimatedStyle, withTiming, withRepeat, withDelay, Easing
} from 'react-native-reanimated';

const VoiceBars = () => {
// Shared values for each bar's height
const h1 = useSharedValue(10);
const h2 = useSharedValue(10);
const h3 = useSharedValue(10);
const h4 = useSharedValue(10);

// Animated style for each bar
const barStyle = (h) => useAnimatedStyle(() => ({
height: h.value
}));

const barStyle1 = barStyle(h1);
const barStyle2 = barStyle(h2);
const barStyle3 = barStyle(h3);
const barStyle4 = barStyle(h4);

useEffect(() => {
// Animate each bar to a taller height and back down, with different delays
const maxHeight = 40;
h1.value = withRepeat(withTiming(maxHeight, { duration: 600, easing: Easing.inOut(Easing.ease) }), -1, true);
h2.value = withDelay(150, withRepeat(withTiming(maxHeight, { duration: 600, easing: Easing.inOut(Easing.ease) }), -1, true));
h3.value = withDelay(300, withRepeat(withTiming(maxHeight, { duration: 600, easing: Easing.inOut(Easing.ease) }), -1, true));
h4.value = withDelay(450, withRepeat(withTiming(maxHeight, { duration: 600, easing: Easing.inOut(Easing.ease) }), -1, true));
}, []);

return (
<View style={styles.container}>
{/_ Render four bars with animated height styles _/}
<Animated.View style={[styles.bar, barStyle1]} />
<Animated.View style={[styles.bar, barStyle2]} />
<Animated.View style={[styles.bar, barStyle3]} />
<Animated.View style={[styles.bar, barStyle4]} />
</View>
);
};

const styles = StyleSheet.create({
container: {
flexDirection: 'row',
alignItems: 'flex-end', // align bars to bottom
justifyContent: 'center'
},
bar: {
width: 10,
backgroundColor: '#4A90E2',
marginHorizontal: 4,
borderRadius: 5,
height: 10 // initial height
}
});

export default VoiceBars;
In this snippet, each bar starts at a height of 10. On mount, we animate each hN value to maxHeight (40) and back to 10 continuously (withRepeat with reverse=true). Each bar’s animation is delayed a bit more than the previous (withDelay of 150ms increments), so they peak at different times. This creates a simple bouncing equalizer effect. You can tweak the timing, height range, number of bars, and even add randomness for variety. For example, instead of a fixed maxHeight, you could periodically set hN.value = withTiming(Math.random()\*40+10, ...) inside a loop or interval to vary each bar's peak height. Note: We’re manually simulating the waveform. If you ever wanted to tie this to real audio levels (microphone input), you’d use an audio API (like expo-av or Web Audio) to get volume data and map that to the bar heights. But here, our approach keeps things simple and Expo-friendly by avoiding any native modules.
Example 3: Morphing Waveform with SVG (Advanced)
For a more advanced effect, you can use SVG paths or shapes to create a continuously morphing waveform or blob. For instance, imagine a wavy line that undulates, or a blob that changes shape as the assistant “speaks.” This can be done with react-native-svg and Reanimated:
Use Svg components (like <Path> or <Circle>) for the graphic. For a waveform, you might draw a path that looks like a sine wave or an oscillating curve.
Leverage useAnimatedProps from Reanimated to animate the SVG properties. For example, you could animate a circle’s radius or a path’s control points. By wrapping the SVG component in Animated.createAnimatedComponent, you can attach animated props to it
docs.swmansion.com
.
As an example, you could have a path defined by some control points and then animate those points up and down with sine functions or random values on a loop. This is more complex (involves some math for path coordinates), but can produce a very dynamic visual.
Tip: If animating SVG paths directly is complex, an easier workaround is to animate simpler shapes that approximate a waveform – like the bar approach above, or a series of small circles along a line that rise/fall. These can often look like a single wave when blurred or placed close together.
Structuring the Animation Component
To integrate these animations in your app, it’s best to encapsulate them in a reusable component. For example, you might have a <AssistantAnimation mode="listening" /> that internally decides which animation to show (orb vs. waveform), or separate components like <ListeningOrb /> and <VoiceBars /> used in different contexts. Key points for structuring the component:
Self-Contained Animation: The component should handle its animation setup internally (as shown with useEffect starting the loop). This way, when you include <PulsingOrb /> in your JSX, it starts animating automatically.
Activation Control: If you need to turn the animation on/off (e.g., only animate when the assistant is active), you can control that by conditionally rendering the component or by passing a prop. For example, <PulsingOrb active={isListening} />. Inside the component, use an active prop to start/stop the animation. Stopping a Reanimated loop can be done by setting a shared value to a stable value or unmounting the component. An easy approach is to only render the animation component when needed: {isListening && <PulsingOrb />} – when isListening becomes false, the component unmounts and the animation automatically cleans up.
Styling and Placement: You might want the animation to overlay other UI (for instance, float over the assistant’s avatar or at the bottom of the screen). You can achieve this with absolute positioning in your styles, or by placing the component in your layout where you want the effect. The internal styles of the component (as we set with styles.container) can use flex or absolute positioning as needed to center the elements.
By organizing it as a component, you can easily swap out the animation type or adjust its props (size, color, etc.) in one place. For example, you could have a prop for color theme: <PulsingOrb color="#FF8800" /> and use that in the styles for the circle’s background. Both of our examples above use a hardcoded color #4A90E2 – you can change this to match your app’s branding or make it dynamic.
Conclusion
Using React Native Reanimated 2 (with or without helpers like Moti), you can create smooth, visually appealing animations in Expo without ejecting or relying on Lottie files. We demonstrated two patterns: a pulsing ripple orb and an equalizer-style waveform, both suitable for simulating an AI assistant’s voice activity. These components run entirely on the UI thread for 60fps performance and do not require any actual audio data – they simulate the interaction state visually. Feel free to experiment with these patterns: adjust the timing and easing for a different feel, add more circles or bars, change colors, or even combine effects (e.g., a pulsing orb that also slightly changes color or has a glow). The approach outlined here provides a flexible foundation for an engaging AI assistant animation, all within the comfort of the Expo ecosystem. Enjoy building your virtual assistant’s personality! Sources: Reanimated 2 documentation and community examples were referenced to ensure proper usage of hooks and looping animations
medium.com
medium.com
docs.swmansion.com
. The Moti library’s usage for looping animations was also referenced for an alternative implementation
medium.com
. These resources provide additional insights into creating custom animations without external animation files.
