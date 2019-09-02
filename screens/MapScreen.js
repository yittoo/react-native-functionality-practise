import React, { useState, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import Colors from "../constants/Colors";

const MapScreen = props => {
  const [selectedLocation, setSelectedLocation] = useState();

  const mapRegion = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const saveMapLocationHandler = useCallback(() => {
    if (!selectedLocation)
      return Alert.alert(
        "No location selected!",
        "Please select a location before saving",
        [{ text: "Ok" }]
      );
    props.navigation.navigate({
      routeName: "NewPlace",
      params: { selectedLocation }
    });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveAction: saveMapLocationHandler });
  }, [saveMapLocationHandler]);

  let markerCoordinates;
  if (selectedLocation) {
    const { latitude, longitude } = selectedLocation;
    markerCoordinates = { latitude, longitude };
  }
  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  return {
    headerRight: (
      <TouchableOpacity
        style={styles.headerButton}
        onPress={navData.navigation.getParam("saveAction")}
      >
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === "android" ? "white" : Colors.primary
  }
});

export default MapScreen;
