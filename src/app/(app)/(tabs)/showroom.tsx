import React, { FC, useEffect, useRef, useState } from "react"
import { Image, ImageStyle, SectionList, TextStyle, View, ViewStyle } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { type ContentStyle } from "@shopify/flash-list"
import { ListItem, ListView, ListViewRef, Screen, Text } from "src/components"
import { isRTL } from "src/i18n"
import { colors, spacing } from "src/theme"
import { useSafeAreaInsetsStyle } from "src/utils/useSafeAreaInsetsStyle"
import * as Demos from "src/components/Showroom/demos"
import { DrawerIconButton } from "src/components/Showroom/DrawerIconButton"
import { Link, useLocalSearchParams } from "expo-router"

const logo = require("assets/images/logo.png")

interface DemoListItem {
  item: { name: string; useCases: string[] }
  sectionIndex: number
  handleScroll?: (sectionIndex: number, itemIndex?: number) => void
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

const ShowroomListItem: FC<DemoListItem> = ({ item, sectionIndex }) => {
  const sectionSlug = item.name.toLowerCase()

  return (
    <View>
      <Link href={{ pathname: "/showroom", params: { sectionSlug } }}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map((u) => {
        const itemSlug = slugify(u)
        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            href={{ pathname: "/showroom", params: { sectionSlug, itemSlug } }}
            asChild
          >
            <ListItem text={u} rightIcon={isRTL ? "caretLeft" : "caretRight"} />
          </Link>
        )
      })}
    </View>
  )
}

export default function DemoShowroomScreen() {
  const [open, setOpen] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const listRef = useRef<SectionList>(null)
  const menuRef = useRef<ListViewRef<DemoListItem["item"]>>(null)

  const params = useLocalSearchParams<{
    sectionSlug?: string
    itemSlug?: string
  }>()

  // handle scroll when section/item params change
  React.useEffect(() => {
    if (Object.keys(params).length > 0) {
      const demoValues = Object.values(Demos)
      const findSectionIndex = demoValues.findIndex(
        (x) => x.name.toLowerCase() === params.sectionSlug,
      )
      let findItemIndex = 0
      if (params.itemSlug) {
        try {
          findItemIndex =
            demoValues[findSectionIndex].data.findIndex(
              (u) => slugify(u.props.name) === params.itemSlug,
            ) + 1
        } catch (err) {
          console.error(err)
        }
      }
      handleScroll(findSectionIndex, findItemIndex)
    }
  }, [params])

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleScroll = (sectionIndex: number, itemIndex = 0) => {
    listRef.current?.scrollToLocation({
      animated: true,
      itemIndex,
      sectionIndex,
    })
    toggleDrawer()
  }

  const scrollToIndexFailed = (info: {
    index: number
    highestMeasuredFrameIndex: number
    averageItemLength: number
  }) => {
    listRef.current?.getScrollResponder()?.scrollToEnd()
    timeout.current = setTimeout(
      () =>
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex: info.index,
          sectionIndex: 0,
        }),
      50,
    )
  }

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current)
  }, [])

  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType={"slide"}
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$logoContainer}>
            <Image source={logo} style={$logoImage} />
          </View>

          <ListView<DemoListItem["item"]>
            ref={menuRef}
            contentContainerStyle={$listContentContainer}
            estimatedItemSize={250}
            data={Object.values(Demos).map((d) => ({
              name: d.name,
              useCases: d.data.map((u) => u.props.name as string),
            }))}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index: sectionIndex }) => (
              <ShowroomListItem {...{ item, sectionIndex, handleScroll }} />
            )}
          />
        </View>
      )}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
        <DrawerIconButton onPress={toggleDrawer} {...{ open }} />

        <SectionList
          ref={listRef}
          contentContainerStyle={$sectionListContentContainer}
          stickySectionHeadersEnabled={false}
          sections={Object.values(Demos)}
          renderItem={({ item }) => item}
          renderSectionFooter={() => <View style={$demoUseCasesSpacer} />}
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoShowroomScreen.jumpStart" />
            </View>
          }
          onScrollToIndexFailed={scrollToIndexFailed}
          renderSectionHeader={({ section }) => {
            return (
              <View>
                <Text preset="heading" style={$demoItemName}>
                  {section.name}
                </Text>
                <Text style={$demoItemDescription}>{section.description}</Text>
              </View>
            )
          }}
        />
      </Screen>
    </Drawer>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
}

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
}

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  paddingHorizontal: spacing.lg,
}

const $demoItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
}

const $demoItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
}

const $demoUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
}
