import { WebView as RNWebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";
import React from "react";

interface WebViewProps {
  url: string;
}

export const WebView: React.FC<WebViewProps> = ({ url }) => {
  return (
    <View style={styles.container}>
      <RNWebView style={styles.container} source={{ uri: url }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    // https://stackoverflow.com/questions/35451139/react-native-webview-not-loading-any-url-react-native-web-view-not-working
    width: "100%",
  },
  webview: {
    flex: 1,
  },
});
