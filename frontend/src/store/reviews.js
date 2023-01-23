import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const getReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews,
    };
};

const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        review,
    };
};

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId,
    }
};

export const getAllReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if(response.ok){
        const reviews = await response.json();
        dispatch(getReviews(reviews));
        return reviews;
    }
};

export const createAReview = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review),
    });
    if(response.ok){
        const brandNewReview = await response.json();
        dispatch(createReview(brandNewReview));
        return brandNewReview;
    }
};

export const deleteAReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`,{
        method: "DELETE"
    });
    if(response.ok){
        const review = await response.json();
        dispatch(deleteReview(review));
        return review;
    }
};

const initialState = { spotReviews: {}, personReviews: {} };

const reviewsReducer = (state = initialState, action) => {
    let newState;

    switch(action.type){
        case LOAD_REVIEWS: {
            newState = { spotReviews: {}, personReviews: {} };
            action.reviews.Reviews.forEach((review) => {
                newState.spotReviews[review.id] = review;
            });
            return newState;
        }
        case CREATE_REVIEW: {
            newState = {...state};
            newState[action.review.id] = action.review;
            return newState;
        }
        case DELETE_REVIEW: {
            newState = {
                ...state,
                spotReviews: {...state.spotReviews},
                personReviews: {...state.personReviews},
            };
            delete newState.spotReviews[action.reviewId.id];
            delete newState.personReviews[action.reviewId.id];
            return newState;
        }
        default: {
            return state;
        }
    }
};
export default reviewsReducer;
