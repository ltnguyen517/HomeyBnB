import { csrfFetch } from "./csrf";

//Action types
const GET_SPOTS = 'spots/GET_SPOTS';
const GET_A_SPOT = 'spots/GET_A_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';


//Action creators
export const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots
});

export const getASpot = (spot) => ({
    type: GET_A_SPOT,
    spot
});

export const createSpot = (novelSpot) => ({
    type: CREATE_SPOT,
    novelSpot
});

export const editSpot = (reviseSpot) => ({
    type: EDIT_SPOT,
    reviseSpot
});

export const deleteSpot = (id) => ({
    type: DELETE_SPOT,
    id
});

//Thunks
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    if(response.ok){
        const spots = await response.json();
        dispatch(getSpots(spots));
    }
    return response
};

export const getSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if(response.ok){
        const spot = await response.json();
        dispatch(getASpot(spot))
    }
    return response
};

export const createNovelSpot = (newSpot) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newSpot)
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

export const editASpot = (updateSpot, id) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateSpot)
    });
    if(response.ok){
        const updateSpot = await response.json();
        dispatch(editSpot(updateSpot));
        return updateSpot;
    }
};

export const deleteASpot = (id) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE'
    });
    if(response.ok){
        const deletedSpot = await response.json();
        dispatch(deleteSpot(deletedSpot));
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
            newState = {...state};
            newState.singleSpot = action.novelSpot;
            return newState;
        }
        case EDIT_SPOT: {
            newState = {...state};
            newState.singleSpot = action.reviseSpot;
            return newState;
        }
        case DELETE_SPOT: {
            newState = {...state};
            delete newState[action.id];
            return newState;
        }
        default:
            return state
    }
}
export default spotsReducer;
