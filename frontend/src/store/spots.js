import { csrfFetch } from "./csrf";

//Action types
const GET_SPOTS = 'spots/GET_SPOTS';
const GET_A_SPOT = 'spots/GET_A_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';


//Action creators
const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots,
    }
};

const getASpot = (spot) => {
    return {
        type: GET_A_SPOT,
        spot,
    }
};

const createSpot = (novelSpot) => {
    return {
        type: CREATE_SPOT,
        novelSpot,
    }
};

const editSpot = (reviseSpot) => {
    return {
        type: EDIT_SPOT,
        reviseSpot,
    }
};

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId,
    }
};

//Thunks
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    if(response.ok){
        const spots = await response.json();
        dispatch(getSpots(spots));
    }
};

export const getSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if(response.ok){
        const spot = await response.json();
        dispatch(getASpot(spot));
    }
};

export const createNovelSpot = (newSpot) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newSpot),
    });
    if(response.ok){
        const novelSpot = await response.json();
        const resTwo = await csrfFetch(`/api/spots/${novelSpot.id}/images`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ url: newSpot.previewImage, preview: true })
        });
        if(resTwo.ok){
            novelSpot.previewImage = newSpot.previewImage;
            dispatch(createSpot(novelSpot));
            return novelSpot;
        }
    }
};

export const editASpot = (spotId, updateSpot) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateSpot)
    });
    if(response.ok){
        const updatedSpot = await response.json();
        dispatch(editSpot(updatedSpot));
        return updatedSpot;
    }
};

export const deleteASpot = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    if(response.ok){
        dispatch(deleteSpot(spotId));
    }
};

const initialState = { allSpots: {}, singleSpot: {} };
//Reducer
const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case GET_SPOTS: {
            newState = { allSpots: {}, singleSpot: {} };
            action.spots.Spots.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        }
        case GET_A_SPOT: {
            newState = {...state, singleSpot: {}};
            newState.singleSpot = action.spot;
            return newState;
        }
        case CREATE_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}};
            if(Array.isArray(action.novelSpot)){
                action.novelSpot.forEach((spot) => {
                    newState.allSpots[spot.id] = spot;
                })
            } else {
                newState.allSpots[action.novelSpot.id] = action.novelSpot;
            }
            return newState;
        }
        case EDIT_SPOT: {
            newState = {...state, singleSpot: action.reviseSpot};
            return newState;
        }
        case DELETE_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}};
            delete newState.allSpots[action.spotId];
            return newState;
        }
        default:
            return state
    }
}
export default spotsReducer;
