Think in Folders, Not Code
Expo Router turns every directory that contains \_layout.tsx into a navigator. A file outside those directories becomes a screen. Nesting folders ⇒ nesting navigators.
Expo Documentation
Expo Documentation

3. File‑Structure Blueprint
pgsql
Copy
Edit
app/ ← root Stack (optional)
\_layout.tsx
(tabs)/ ← bottom bar with “Home”, “Profile”, …
\_layout.tsx
home/ ← THIS tab will itself show another tab bar
\_layout.tsx
index.tsx ← redirects to first inner tab
(inner)/ ← any name; () keeps URL clean
\_layout.tsx ← top/secondary tab bar
overview.tsx
stats.tsx
profile.tsx
settings.tsx
Anything in parentheses—(tabs), (inner)—does not appear in the URL, so /home/overview is nice and clean.
Expo Documentation
Expo Documentation

4. Root (optional)
ts
Copy
Edit
// app/\_layout.tsx
import { Stack } from 'expo-router';
export default Stack; // keeps things simple
If you don’t need modals or auth guards at the root, you can omit this file.

5. Main Bottom Tabs
ts
Copy
Edit
// app/(tabs)/\_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function MainTabs() {
return (
<Tabs screenOptions={{ headerShown: false }}>
<Tabs.Screen
name="home"
options={{ title: 'Home', tabBarIcon: ({ color }) =>
          <FontAwesome name="home" size={24} color={color} /> }}
/>
<Tabs.Screen
name="profile"
options={{ title: 'Profile', tabBarIcon: ({ color }) =>
          <FontAwesome name="user" size={24} color={color} /> }}
/>
<Tabs.Screen name="settings" options={{ title: 'Settings' }} />
</Tabs>
);
}
The Tabs component comes directly from Expo Router and wraps React‑Navigation’s bottom‑tab navigator under the hood.
Expo Documentation

6. Redirect the Parent Screen (optional but tidy)
ts
Copy
Edit
// app/(tabs)/home/index.tsx
import { Redirect } from 'expo-router';
export default function () {
return <Redirect href="/home/overview" />;
}
Because home now hosts its own tab bar, we immediately send users to the first inner tab.

You can also set an initialRouteName in router settings, but using <Redirect> keeps deep‑links predictable.
Expo Documentation

7. Inner (‘secondary’) Tabs
ts
Copy
Edit
// app/(tabs)/home/(inner)/\_layout.tsx
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeInnerTabs() {
return (
<Tabs
screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      }}>
<Tabs.Screen
name="overview"
options={{ title: 'Overview', tabBarIcon: ({ color }) =>
          <MaterialIcons name="dashboard" size={22} color={color} /> }}
/>
<Tabs.Screen
name="stats"
options={{ title: 'Stats', tabBarIcon: ({ color }) =>
          <MaterialIcons name="bar-chart" size={22} color={color} /> }}
/>
</Tabs>
);
}
Nested Tabs work exactly the same as the outer ones—the only difference is they live inside another screen.
Expo Documentation
Expo Documentation

8. Navigating In and Out
ts
Copy
Edit
import { Link, router } from 'expo-router';

// Declarative link

<Link href="/home/stats">Go to Stats</Link>

// Imperative
router.push('/profile');
Because every layout is a real URL, deep‑linking (e.g. /home/stats) “just works”.
Expo Documentation
Expo Documentation

9. Common Pitfalls & Pro Tips
Issue Fix
Duplicate tab bar inside modal screens Wrap modals in a root Stack outside (tabs) so they sit above everything.
Expo Documentation
Wrong default inner tab when deep‑linking Add export const unstable_settings = { initialRouteName: 'overview' } to the inner \_layout.tsx.
Expo Documentation
Need tabs and stack inside same section Replace the inner Tabs with a Stack, or mix layouts exactly like the docs’ “Stacks inside tabs” pattern.
Expo Documentation
Hide a route from the bar Pass options={{ href: null }} to <Tabs.Screen> so it’s navigable but not visible.
Expo Documentation
SEO / web breadcrumbs Because nested tabs are just folders, titles and metadata can be set per file via export const generateMetadata = ….

10. Wrap‑up
Create (tabs)/\_layout.tsx for the main bar.

Create a folder for the tab you want to nest (home/) and, inside it, another folder (inner)/\_layout.tsx that returns a second <Tabs> navigator.

Redirect or set initialRouteName so the correct nested tab opens first.

Use normal Link or router.push to move between any tab at any depth.

That’s all there is—no registry calls or manual navigator wiring. Let the file system do the work and enjoy a clear, URL‑driven architecture!

Expo Router offers a set of components to create custom tab layouts via the submodule expo-router/ui. Unlike the React Navigation styled Tabs, these components are unstyled and flexible. They are designed to allow you build complex UI patterns from scratch in your project.

Anatomy of custom Tabs components
There are four components offered by expo-router/ui to create custom tab layouts:

Component Description
Tabs Wrapper component which contains the <View> for the tabs.
TabList The containing <View> for the list of TabTrigger components.
TabTrigger A trigger component to switch to the specified tab. It is used to define the route using href prop and a name for each tab.
TabSlot A slot to render the currently selected tab.
A bare minimum structure of a custom tab layout would consist of a TabList (containing TabTrigger components for each tab) and aTabSlot, all within the Tabs component, as shown here:

app/(tabs)/\_layout.tsx

Copy

import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Text } from 'react-native';

// Defining the layout of the custom tab navigator
export default function Layout() {
return (
<Tabs>
<TabSlot />
<TabList>
<TabTrigger name="home" href="/">
<Text>Home</Text>
</TabTrigger>
<TabTrigger name="article" href="/article">
<Text>Article</Text>
</TabTrigger>
</TabList>
</Tabs>
);
}
Creating routes
The TabList contains all the routes available within the tab navigator. It must be an immediate child of Tabs. Each route is defined by a TabTrigger within the TabList. A TabTrigger within a TabList must include a name and a href prop.

Typically, the TabList defines both the available tab routes and the appearance of the tabs, with the children of each TabTrigger defining the appearance of each tab button.

Note: A name can be any string. This is a user-defined name for the Tab.

Dynamic routes
Dynamic routes are allowed and can be provided with values via the href.

\_layout.tsx
[slug].tsx
The trigger <TabTrigger name="dynamic page" href="/hello-world" /> will create a tab for [slug].tsx with the params { slug: 'hello-world' }. This setup can be useful for displaying an arbitrary number of tabs in the tab bar, based on end-user data, such as showing a separate tab for each user profile in an app.

Ambiguous routes
\_layout.tsx
(one,two)

route.tsx
A route within a shared group
The href values provided to TabTrigger must always point to a single route. In the above example of a shared route, href /route is not allowed, as it could refer to either /(one)/route or /(two)/route. However, specifying the route group within the href would work (for example,href="/(one)/route").

Nested routes
\_layout.tsx
(stack-one)

\_layout.tsx
A <Stack> layout

(stack-two)

\_layout.tsx
Nested <Stack> layout

route.tsx
A TabTrigger can link to a deeply nested route. <TabTrigger name="route" href="/route" /> will show the (stack-one)/(stack-two)/route.tsx route. This tab will be controlled by that route's parent navigator (that is, the navigator within stack-two_layout.tsx). This navigation is similar to a deep link.

Rendering routes
The TabSlot component renders the current route. TabSlot can be nested inside other components within Tabs but cannot be within the TabList.

app/\_layout.tsx

Copy

<Tabs>
  <TabList>
    <TabTrigger name="home" href="/">
      <Text>Home</Text>
    </TabTrigger>
  </TabList>
  {/* Customize how `<TabSlot />` is rendered. */}
  <View>
    <View>
      <TabSlot />
    </View>
  </View>
</Tabs>
Switching tabs
Tabs can be switched via a Link or using the imperative APIs. However, these APIs will always perform a navigation action (they will switch tabs and might change the URL). To switch tabs without performing any navigation, you should use a TabTrigger. A TabTrigger is an unstyled <View> that will switch tabs when pressed, much like how text and components can be wrapped in Link to make them pressable navigation elements.

Resetting navigation
The reset prop from TabTrigger can be used to control when a tab resets its navigation state. The options are always, onLongPress and never. This is particularly useful for a stack navigator nested inside a tab. For example, <TabTrigger name="home" reset="always" /> will return the user to the index route inside a tab's nested stack navigator.

TabTrigger
The TabTrigger is used to switch tabs, but also has a dual role of defining what routes are available as a tab.

Within TabList
When a TabTrigger is used as a child of TabList, that defines what routes are available within the tab navigator. These TabTrigger need to include both the name and href props, as they define the URL for that tab and a custom name that can be used to refer to the tab. If the TabTrigger components also contain text or other components as children, then those will also render as the tab buttons. However, you can define the TabTrigger's within the TabList without any UI, and they can then be invoked by TabTrigger's outside of the TabList.

Outside TabList
An additional TabTrigger can be defined outside of a TabList, allowing you to perform the same action as the TabTrigger that is defined in the TabList. In this case, the TabTrigger will not have an href prop. Rather, it will perform the same action as the primary TabTrigger with the same name prop. This allows you to create components that can switch tabs and be agnostic to your current navigation state. Note that all TabTrigger's need to at least be descendants of the Tabs component, or else they will be considered to be outside the tab navigator and unable to invoke it.

Customizing appearance
All components are rendered unstyled as a <View>, except TabTrigger which renders as a <Pressable>. This allows you to provide a custom style prop to customize their appearance. Styling TabList is similar to customizing the tab bar in React Navigation, while styling TabTrigger affects the appearance of tab buttons.

If you need to change the structure of a component, you can override its underlying component by using the asChild props. The component then acts as a slot, and will forward its props to its immediate child.

Custom TabList

Copy

<Tabs>
  <TabSlot />
  <TabList asChild>
    {/* Render a custom TabList */}
    <CustomTabList>
      <TabTrigger name="home" href="/">
        <Text>Home</Text>
      </TabTrigger>
    </CustomTabList>
  </TabList>
</Tabs>
Custom Button

Copy

<Tabs>
  <TabSlot />
  <TabList asChild>
    <TabTrigger name="home" href="/" asChild>
      {/* Render a custom button */}
      <CustomButton>
        <Text>Home</Text>
      </CustomButton>
    </TabTrigger>
  </TabList>
</Tabs>
Multiple tab bars
The TabList is both the configuration and default appearance of the Tabs, but it is not the only way to render a tab bar. By hiding the TabList, you can construct custom tab bars using TabTrigger.

Multiple tab bars example

Copy

<Tabs>
  <TabSlot />
  {/* A custom tab bar */}
  <View>
    <View>
      <TabTrigger name="home">
        <Text>Home</Text>
      </TabTrigger>
      <TabTrigger name="article">
        <Text>article</Text>
      </TabTrigger>
    </View>
  </View>
  <TabList style={{ display: 'none' }}>
    <TabTrigger name="home" href="/">
      <Text>Home</Text>
    </TabTrigger>
    <TabTrigger name="article" href="/article">
      <Text>article</Text>
    </TabTrigger>
  </TabList>
</Tabs>
TabTrigger will forward an isFocused prop, so you can create a separate tab button component that reacts to focused status.

TabButton.tsx

Copy

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, Ref } from 'react';
import { Text, Pressable, View } from 'react-native';

type Icon = ComponentProps<typeof FontAwesome>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
icon?: Icon;
ref: Ref<View>;
};

export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
return (
<Pressable
{...props}
style={[
{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
flexDirection: 'column',
gap: 5,
padding: 10,
},
isFocused ? { backgroundColor: 'white' } : undefined,
]}>
<FontAwesome name={icon} />
<Text style={[{ fontSize: 16 }, isFocused ? { color: 'white' } : undefined]}>{children}</Text>
</Pressable>
);
}

Show More
Expo SDK 52 / React 18 and below

Hooks
All components also have a hook version giving you control over the render tree. See the Router UI Reference for a full list of the hooks available.

Using hooks is considered advanced usage of this library. For most use-cases, using the components with asChild should give you enough control over the render tree.

If you are developing a custom <TabTrigger />, you may also need to develop a custom <TabList /> as <TabList /> uses the useTabsWithChildren() which requires using the exported <TabTrigger /> component.

Customizing how tab screens are rendered
The TabSlot accepts a renderFn property. This function can be used to override how your screen is rendered, allowing you to implement advanced functionality such as animations or persisting/unmounting screens. See the Router UI Reference for more information.

Common questions
How do I create multiple tabs for the same route?
\_layout.tsx
Tabs layout
(movie,tv)

[id].tsx
You should add the route to a shared group and create a separate TabTrigger for each group group.

How do I hide a tab?
Not rendering the TabTrigger will remove that tab (and its navigation state) from your app.

How do I create animated tabs?
You can provide a custom renderer to TabSlot to customize how it renders a screen. You can use this to detect when screen is focused an animate appropriately.

Can I use relative hrefs?
directory

\_layout.tsx
The local pathname is /directory

page.tsx
The pathname is /directory/page

profile.tsx
The pathname is /directory/page
A TabTrigger with a relative href is relative to the local path name Tabs was rendered on. This is different from normal relative hrefs which are relative to the current displayed route. For example, the <TabTrigger href="./profile" /> will resolve to /directory/profile, even when the /directory/page route is showing. Expo recommends against using relative hrefs.

Previous (Expo Router - Advanced)

Apple Handoff

Next (Expo Router - Reference)

Error handling

A stack navigator is the foundational way of navigating between routes in an app. On Android, a stacked route animates on top of the current screen. On iOS, a stacked route animates from the right. Expo Router provides a Stack navigation component that creates a navigation stack and allows you to add new routes in your app.

This guide provides information on how you can create a Stack navigator in your project and customize an individual route's options and header.

Get started
You can use file-based routing to create a stack navigator. Here's an example file structure:

app

\_layout.tsx

index.tsx

details.tsx
This file structure produces a layout where the index route is the first route in the stack, and the details route is pushed on top of the index route when navigated.

You can use the app/\_layout.tsx file to define your app's Stack navigator with these two routes:

app/\_layout.tsx

Copy

import { Stack } from 'expo-router';

export default function Layout() {
return <Stack />;
}
Screen options and header configuration
Statically configure route options
You can use the <Stack.Screen name={routeName} /> component in the layout component route to statically configure a route's options. This is also useful for tabs or drawers as they need an icon defined ahead of time.

app/\_layout.tsx

Copy

import { Stack } from 'expo-router';

export default function Layout() {
return (
<Stack
screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
{/_ Optionally configure static options outside the route._/}
<Stack.Screen name="home" options={{}} />
</Stack>
);
}
As an alternative to the <Stack.Screen> component, you can use navigation.setOptions() to configure a route's options from within the route's component file.

app/index.tsx

Copy

import { Stack, useNavigation } from 'expo-router';
import { Text, View } from 'react-native';
import { useEffect } from 'react';

export default function Home() {
const navigation = useNavigation();

useEffect(() => {
navigation.setOptions({ headerShown: false });
}, [navigation]);

return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
<Text>Home Screen</Text>
</View>
);
}
Configure header bar
You can configure the header bar for all routes in a Stack navigator by using the screenOptions prop. This is useful for setting a common header style across all routes.

app/\_layout.tsx

Copy

import { Stack } from 'expo-router';

export default function Layout() {
return (
<Stack
screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
/>
);
}
To configure the header bar dynamically for an individual route, use that navigator's <Stack.Screen> component in the routes's file. This is useful for interactions that change the UI.

app/index.tsx

Copy

import { Link, Stack } from 'expo-router';
import { Image, Text, View, StyleSheet } from 'react-native';

function LogoTitle() {
return (
<Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
);
}

export default function Home() {
return (
<View style={styles.container}>
<Stack.Screen
options={{
title: 'My home',
headerStyle: { backgroundColor: '#f4511e' },
headerTintColor: '#fff',
headerTitleStyle: {
fontWeight: 'bold',
},

          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Text>Home Screen</Text>
      <Link href={{ pathname: 'details', params: { name: 'Bacon' } }}>Go to Details</Link>
    </View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
},
image: {
width: 50,
height: 50,
},
});

Show More
Available header options
The Stack navigator supports comprehensive header configuration options. Below are all the header-related options available:

Header options

Set screen options dynamically
To configure a route's option dynamically, you can always use the <Stack.Screen> component in that route's file.

As an alternative, you can also use the imperative API's router.setParams() function to configure the route dynamically.

app/details.tsx

Copy

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
const router = useRouter();
const params = useLocalSearchParams();

return (
<View style={styles.container}>
<Stack.Screen
options={{
          title: params.name,
        }}
/>
<Text
onPress={() => {
router.setParams({ name: 'Updated' });
}}>
Update the title
</Text>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
},
});

Show More
Header buttons
You can add buttons to the header by using the headerLeft and headerRight options. These options accept a React component that renders in the header.

app/index.tsx

Copy

import { Stack } from 'expo-router';
import { Button, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

function LogoTitle() {
return (
<Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
);
}

export default function Home() {
const [count, setCount] = useState(0);

return (
<>
<Stack.Screen
options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: () => <Button onPress={() => setCount(c => c + 1)} title="Update count" />,
        }}
/>
<Text>Count: {count}</Text>
</>
);
}

const styles = StyleSheet.create({
image: {
width: 50,
height: 50,
},
});

Show More
Other screen options
For a complete list of all available other screen options including animations, gestures, and other configurations:

Screen options

Custom push behavior
By default, the Stack navigator removes duplicate screens when pushing a route that is already in the stack. For example, if you push the same screen twice, the second push will be ignored. You can change this push behavior by providing a custom getId() function to the <Stack.Screen>.

For example, the index route in the following layout structure shows a list of different user profiles in the app. Let's make the [details] route a dynamic route so that the app user can navigate to see a profile's details.

app

\_layout.tsx

index.tsx

[details].tsx
matches dynamic paths like '/details1'
The Stack navigator will push a new screen every time the app user navigates to a different profile but will fail. If you provide a getId() function that returns a new ID every time, the Stack will push a new screen every time the app user navigates to a profile.

You can use the <Stack.Screen name="[profile]" getId={}> component in the layout component route to modify the push behavior:

app/\_layout.tsx

Copy

import { Stack } from 'expo-router';

export default function Layout() {
return (
<Stack>
<Stack.Screen
name="[profile]"
getId={
({ params }) => String(Date.now())
}
/>
</Stack>
);
}
Removing stack screens
There are different actions you can use to dismiss and remove one or many routes from a stack.

dismiss action
Dismisses the last screen in the closest stack. If the current screen is the only route in the stack, it will dismiss the entire stack.

You can optionally pass a positive number to dismiss up to that specified number of screens.

Dismiss is different from back as it targets the closest stack and not the current navigator. If you have nested navigators, calling dismiss will take you back multiple screens.

app/settings.tsx

Copy

import { Button, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
const router = useRouter();

const handleDismiss = (count: number) => {
router.dismiss(count)
};

return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
<Button title="Go to first screen" onPress={() => handleDismiss(3)} />
</View>
);
}
dismissTo action
dismissTo was added in Expo Router 4.0.8. It operates similarly to the navigation function in Expo Router v3.

Dismisses screens in the current <Stack /> until the specified Href is reached. If the Href is absent in the history, a push action will be performed instead.

For example, consider the history of /one, /two, /three routes, where /three is the current route. The action router.dismissTo('/one') will cause the history to go back twice, while router.dismissTo('/four') will push the history forward to the /four route.

app/settings.tsx

Copy

import { Button, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
const router = useRouter();

const handleDismissAll = () => {
router.dismissTo('/')
};

return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
<Button title="Go to first screen" onPress={handleDismissAll} />
</View>
);
}
dismissAll action
To return to the first screen in the closest stack. This is similar to popToTop stack action.

For example, the home route is the first screen, and the settings is the last. To go from settings to home route you'll have to go back to details. However, using the dismissAll action, you can go from settings to home and dismiss any screen in between.

app/settings.tsx

Copy

import { Button, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
const router = useRouter();

const handleDismissAll = () => {
router.dismissAll()
};

return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
<Button title="Go to first screen" onPress={handleDismissAll} />
</View>
);
}
canDismiss action
To check if it is possible to dismiss the current screen. Returns true if the router is within a stack with more than one screen in the stack's history.

app/settings.tsx

Copy

import { Button, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
const router = useRouter();

const handleDismiss = (count: number) => {
if (router.canDismiss()) {
router.dismiss(count)
}
};

return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
<Button title="Maybe dismiss" onPress={() => handleDismiss()} />
</View>
);
}
Relation with Native Stack Navigator
The Stack navigator in Expo Router wraps the Native Stack Navigator from React Navigation. Options available in the Native Stack Navigator are all available in the Stack navigator in Expo Router.

JavaScript stack with @react-navigation/stack
You can also use the JavaScript-powered @react-navigation/stack library to create a custom layout component by wrapping this library with the withLayoutContext.

In the following example, JsStack component is defined using @react-navigation/stack library:

layouts/js-stack.tsx

Copy

import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import {
createStackNavigator,
StackNavigationEventMap,
StackNavigationOptions,
} from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
StackNavigationOptions,
typeof Navigator,
StackNavigationState<ParamListBase>,
StackNavigationEventMap

> (Navigator);
> After defining the JsStack component, you can use it in your app:

app/\_layout.tsx

Copy

import { JsStack } from '../layouts/js-stack';

export default function Layout() {
return (
<JsStack
screenOptions={
{
...
}
}
/>
);
}
