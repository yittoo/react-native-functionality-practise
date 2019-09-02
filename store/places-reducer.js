import { ADD_PLACE, SET_PLACES } from "./places-actions";
import Place from "../models/place";

const initialState = {
  places: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLACE:
      const { id, title, imageUri, address, coords } = action.placeData;
      const newPlace = new Place(
        id.toString(),
        title,
        imageUri,
        address,
        coords.lat,
        coords.lng
      );
      return {
        ...state,
        places: state.places.concat(newPlace)
      };
    case SET_PLACES:
      return {
        ...state,
        places: action.places.map(
          pl => new Place(pl.id.toString(), pl.title, pl.imageUri, pl.address, pl.lat, pl.lng)
        )
      };
    default:
      return state;
  }
};
