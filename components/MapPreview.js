import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from "react-native";

import ENV from "../env";
import Colors from "../constants/Colors";

const MapPreview = props => {
  const { isFetching, location, style } = props;
  let lat, lng;
  if (location) {
    lat = location.lat;
    lng = location.lng;
  }
  return (
    <TouchableOpacity onPress={props.onPress} style={{ ...s.mapPreview, ...style }}>
      {isFetching ? (
        <ActivityIndicator color={Colors.primary} size="large" />
      ) : location ? (
        <Image
          style={s.image}
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${lat},${lng}&key=${ENV.googleApi}`
          }}
        />
      ) : (
        <Text>No location chosen yet!</Text>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  mapPreview: {
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    height: "100%",
    width: "100%"
  }
});
export default MapPreview;
