import React from "react"
import { Tabs } from "expo-router/tabs"
import { observer } from "mobx-react-lite"
import { Icon } from "src/components"
import { translate } from "src/i18n"
import { colors, spacing, typography } from "src/theme"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default observer(function Layout() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tabs.Screen
        name="showroom"
        options={{
          href: "/showroom",
          headerShown: false,
          tabBarLabel: translate("demoNavigator.componentsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: "/community",
          headerShown: false,
          tabBarLabel: translate("demoNavigator.communityTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="podcasts"
        options={{
          href: "/podcasts",
          headerShown: false,
          tabBarAccessibilityLabel: translate("demoNavigator.podcastListTab"),
          tabBarLabel: translate("demoNavigator.podcastListTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="podcast" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          href: "/debug",
          headerShown: false,
          tabBarLabel: translate("demoNavigator.debugTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="debug" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
    </Tabs>
  )
})

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}
