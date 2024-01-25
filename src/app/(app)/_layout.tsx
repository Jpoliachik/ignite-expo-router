import React from "react"
import { Redirect, SplashScreen, Stack } from "expo-router"
import { observer } from "mobx-react-lite"
import { useStores } from "src/models"
import { useFonts } from "expo-font"
import { customFontsToLoad } from "src/theme"

export default observer(function Layout() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  if (!isAuthenticated) {
    return <Redirect href="/log-in" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
})
