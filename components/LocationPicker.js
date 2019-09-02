import React, { useState, useEffect } from "react";
import { View, Button, Text, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import MapPreview from "./MapPreview";

import Colors from "../constants/Colors";

const LocationPicker = props => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(
    props.selectedLocation && {
      lat: props.selectedLocation.latitude,
      lng: props.selectedLocation.longitude
    }
  );

  useEffect(() => {
    setPickedLocation(
      props.selectedLocation && {
        lat: props.selectedLocation.latitude,
        lng: props.selectedLocation.longitude
      }
    );
  }, [props.selectedLocation]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 15000
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
      props.onLocationSelect(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (err) {
      Alert.alert(
        "Could not fetch location!",
        `Please try again later or pick a location on the map. Error: ${err}`,
        [{ text: "Okay" }]
      );
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  return (
    <View style={s.locationPicker}>
      <MapPreview
        style={s.mapPreview}
        isFetching={isFetching}
        location={pickedLocation}
        onPress={pickOnMapHandler}
      />
      <View style={s.actions}>
        <Button
          title="Get User Location"
          color={Colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="Pick on Map"
          color={Colors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};
const s = StyleSheet.create({
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1
  },
  locationPicker: {
    marginBottom: 15
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  }
});
export default LocationPicker;
