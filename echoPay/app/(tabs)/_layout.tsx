import { Tabs } from "expo-router"
import { Feather } from "@expo/vector-icons"

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#ffffff", // white
                    borderTopColor: "#e5e7eb", // gray-200
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarActiveTintColor: "#000000", // black
                tabBarInactiveTintColor: "#6b7280", // gray-500
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "AppFontRegular",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "الحسابات",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="credit-card" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bills"
                options={{
                    title: "الفواتير",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="file-text" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: "العمليات",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="beneficiaries"
                options={{
                    title: "المستفيدين",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="users" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
