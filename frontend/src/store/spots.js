import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_A_SPOT = 'spots/GET_A_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';

const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots
});

const getASpot = (spot) => ({
    type: GET_A_SPOT,
    spot
});

const createSpot = (novelSpot) => ({
    type: CREATE_SPOT,
    novelSpot
});

const editSpot = (reviseSpot) => ({
    type: EDIT_SPOT,
    reviseSpot
});

const deleteSpot = (id) => ({
    type: DELETE_SPOT,
    id
});

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

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case GET_SPOTS: {
            newState
        }
    }
}
