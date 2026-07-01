import { StatusBar } from "react-native";
import "./globals.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return(
  <>
  <StatusBar hidden={true}/>
  <Stack>
    <Stack.Screen name = "(tabs)"
    options=  {{headerShown : false}}/>

    <Stack.Screen name = "movie/[id]"
    options=  {{headerShown : false}}/>

  </Stack>
  </>

  )
}
