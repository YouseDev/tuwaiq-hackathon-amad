Core concepts of file-based routing in Expo Router

Learn the ground rules of Expo Router and how it relates to the rest of your code.

Before diving into how to construct your app's navigation tree with Expo Router, let's first understand the core concepts that make up the foundation of file-based routing in Expo Router, and how an Expo Router project might differ in structure from other React Native projects.

The rules of Expo Router

1. All screens/pages are files inside of app directory
   All navigation routes in your app are defined by the files and sub-directories inside the app directory. Every file inside the app directory has a default export that defines a distinct page in your app (except for the special \_layout files).

Accordingly, directories inside app define groups of related screens together as stacks, tabs, or in other arrangements.

2. All pages have a URL
   All pages have a URL path that matches the file's location in the app directory, which can be used to navigate to that page in the address bar on the web, or as an app-specific deep link in a native mobile app. This is what is meant by Expo Router supporting "universal deep-linking". All pages in your app can be navigated to with a URL, regardless of the platform.

3. First index.tsx is the initial route
   With Expo Router, you do not define an initial route or first screen in code. Rather, when you open your app, Expo Router will look for the first index.tsx file matching the / URL. This could be an app/index.tsx file, but it doesn't have to be. If the user should start by default in a deeper part of your navigation tree, you can use a route group (a directory where the name is surrounded in parenthesis), and that will not count as part of the URL. If you want your first screen to be a group of tabs, you might put all of the tab pages inside the app/(tabs) directory and define the default tab as index.tsx. With this arrangement, the / URL will take the user directly to app/(tabs)/index.tsx file.

4. Root \_layout.tsx replaces App.jsx/tsx
   Every project should have a \_layout.tsx file directly inside the app directory. This file is rendered before any other route in your app and is where you would put the initialization code that may have previously gone inside an App.jsx file, such as loading fonts or interacting with the splash screen.

5. Non-navigation components live outside of app directory
   In Expo Router, the app directory is exclusively for defining your app's routes. Other parts of your app, like components, hooks, utilities, and so on, should be placed in other top-level directories. If you put a non-route inside of the app directory, Expo Router will attempt to treat it like a route.

Alternatively, you can create a top-level src directory and put your routes inside the src/app directory, with non-route components going in folders like src/components, src/utils, and so on. This is the only other directory structure that Expo Router will recognize.

6. It's still React Navigation under the hood
   While this may sound quite a bit different from React Navigation, Expo Router is actually built on top of React Navigation. You can think of Expo Router as an Expo CLI optimization that translates your file structure into React Navigation components that you previously defined in your own code.

This also means that you can often refer to React Navigation documentation for how to style or configure navigation, as the default stack and tab navigators use the exact same options.

The rules of Expo Router applied
Let's apply these foundational rules of Expo Router to quickly identify key elements of the following project file structure:

app

index.tsx

home.tsx

\_layout.tsx

profile

friends.tsx
components

TextField.tsx

Toolbar.tsx
app/index.tsx is the initial route, and will appear first when you open the app or navigate to your web app's root URL.
app/home.tsx is a page with the route /home, so you can navigate to it with a URL like yourapp.com/home in the browser, or myapp://home in a native app.
app/\_layout.tsx is the root layout. Any initialization code you may have previously put in App.jsx should go here.
app/profile/friends.tsx is a page with the route /profile/friends.
TextField.tsx and Toolbar.tsx are not in the app directory, so they will not be considered pages. They will not have a URL, and they cannot be the target of a navigation action. However, they can be used as components in the pages inside of the app directory.

---

Expo Router notation

Learn how to use special filenames and notation to expressively define your app's navigation tree within your project's file structure.

When you look inside the app directory in a typical Expo Router project, you'll see a lot more than some simple file and directory names. What do the parentheses and brackets mean? Let's learn the significance of file-based routing notation and how it allows you to define complex navigation patterns.

Types of route notation
Simple names/no notation
app

home.tsx

feed

favorites.tsx
Regular file and directory names without any notation signify static routes. Their URL matches exactly as they appear in your file tree. So, a file named favorites.tsx inside the feed directory will have a URL of /feed/favorites.

Square brackets
app

[userName].tsx

products

[productId]

index.tsx
If you see square brackets in a file or directory name, you are looking at a dynamic route. The name of the route includes a parameter that can be used when rendering the page. The parameter could be either in a directory name or a file name. For example, a file named [userName].tsx will match /evanbacon, /expo, or another username. Then, you can access that parameter with the useLocalSearchParams hook inside the page, using that to load the data for that specific user.

Parentheses
app

(tabs)

index.tsx

settings.tsx
A directory with its name surrounded in parentheses indicates a route group. These directories are useful for grouping routes together without affecting the URL. For example, a file named app/(tabs)/settings.tsx will have /settings for its URL, even though it is not directly in the app directory.

Route groups can be useful for simple organization purposes, but often become more important for defining complex relationships between routes.

index.tsx files
app

(tabs)

index.tsx

profile

index.tsx
Just like on the web, an index.tsx file indicates the default route for a directory. For example, a file named profile/index.tsx will match /profile. A file named (tabs)/index.tsx will match /, effectively becoming the default route for your entire app.

\_layout.tsx files
app

\_layout.tsx

(tabs)

\_layout.tsx

feed

\_layout.tsx
\_layout.tsx files are special files that are not pages themselves but define how groups of routes inside a directory relate to each other. If a directory of routes is arranged as a stack or tabs, the layout route is where you would define that relationship by using a stack navigator or tab navigator component.

Layout routes are rendered before the actual page routes inside their directory. This means that the \_layout.tsx directly inside the app directory is rendered before anything else in the app, and is where you would put the initialization code that may have previously gone inside an App.jsx file.

Plus sign
app

+not-found.tsx

+html.tsx

+native-intent.tsx
Routes starting with a + have special significance to Expo Router, and are used for specific purposes. One example is +not-found, which catches any requests that don't match a route in your app. +html is used to customize the HTML boilerplate used by your app on web. +native-intent is used to handle deep links into your app that don't match a specific route, such as links generated by third party services.

Route notation applied
Consider the following project file structure to identify the different types of routes represented:

app

(tabs)

\_layout.tsx

index.tsx

feed.tsx

profile.tsx

\_layout.tsx

users

[userId].tsx

+not-found.tsx

about.tsx
app/about.tsx is a static route that matches /about.
app/users/[userId].tsx is a dynamic route that matches /users/123, /users/456, and so on.
app/(tabs) is a route group. It will not factor into the URL, so /feed will match app/(tabs)/feed.tsx.
app/(tabs)/index.tsx is the default route for the (tabs) directory, so it will be the initially-focused tab, and will match the / URL.
app/(tabs)/\_layout.tsx is a layout file defining how the three pages inside app/(tabs)/ relate to each other. If you use a tab navigator component inside of this file, then those screens will be arranged as tabs.
app/\_layout.tsx is the root layout file, and is rendered before any other route in the app.
+not-found.tsx is a special route that will be displayed if the user navigates to a route that doesn't exist in your app.
