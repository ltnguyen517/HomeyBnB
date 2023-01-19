import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const getReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
});

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

const deleteReview = (review) => ({
    type: DELETE_REVIEW,
    review
});

export const getAllReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if(response.ok){
        const reviews = await response.json();
        dispatch(getReviews(reviews));
        return reviews;
    }
};

export const createAReview = (spotId, review) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
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

const initialState = { spotReviews: {} };

const reviewsReducer = (state = initialState, action) => {
    let newState;

    switch(action.type){
        case LOAD_REVIEWS: {
            newState = { spotReviews: {} };
            action.reviews.Reviews.forEach((review) => {
                newState.spotReviews[review.id] = review;
            });
            return newState;
        }
        case CREATE_REVIEW: {
            newState = {...state};
            newState.spotReviews[action.review.id] = action.review;
            return newState;
        }
        case DELETE_REVIEW: {
            newState = {...state};
            delete newState.spotReviews[action.reviewId.id];
            return newState;
        }
        default:
            return state;
    }
};
export default reviewsReducer;
