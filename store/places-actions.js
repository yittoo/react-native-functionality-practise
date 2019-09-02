import * as FileSystem from "expo-file-system";
import { insertPlace, fetchPlaces } from "../helpers/db";
import ENV from "../env";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

export const addPlace = (title, imageUri, location) => async dispatch => {
  const { latitude, longitude } = location;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${ENV.googleApi}`
  );

  if (!res.ok)
    throw new Error(
      "Something went wrong during address fetching via given latitude and longitude"
    );

  const resData = await res.json();
  if (!resData.results)
    throw new Error("Results for given lat & lng returned error");

  const address = resData.results[0].formatted_address;
  const fileName = imageUri.split("/").pop();
  const newPath = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.moveAsync({
      from: imageUri,
      to: newPath
    });
    const dbResult = await insertPlace(
      title,
      newPath,
      address,
      latitude,
      longitude
    );
    return dispatch({
      type: ADD_PLACE,
      placeData: {
        id: dbResult.insertId,
        title,
        imageUri: newPath,
        address,
        coords: {
          lat: location.latitude,
          lng: location.longitude
        }
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadPlaces = () => async dispatch => {
  try {
    const res = await fetchPlaces();
    dispatch({ type: SET_PLACES, places: res.rows._array });
  } catch (err) {
    throw err;
  }
};
