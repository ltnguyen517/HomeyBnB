import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getAllReviews } from "../../store/reviews";
import { deleteAReview } from "../../store/reviews";
import './Reviews.css';

const reviewsSection = ({ spot }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const reviewsObj = useSelector((state) => state.reviews.spotReviews);
    const reviews = Object.values(reviewsObj);
    const currentUser = useSelector((state) => state.session.user);
    let { spotId } = useParams();
    spotId = Number(spotId);

    useEffect(() => {
        dispatch(getAllReviews(spotId));
    }, [dispatch, spotId]);

    const userAddRev = reviews.filter((review) => {
        if(!currentUser){
            return [];
        } else {
            return review.userId === currentUser.id && review.spotId === spotId
        }
    });

    const handleReviewButton = (e) => {
        e.preventDefault();
        history.push(`/spots/${spotId}/review`)
    };

    return (
        <>
        <div className="all-reviews-container">
            <h1 className="review-title">User Reviews</h1>
            <div className="review-box-data">
                <div className="box-left-data">
                    <div className="review-star">
                        <i className="fa-solid fa-star"></i>
                        {spot.avgRating}
                    </div>
                    <div className="little-dot"><i className="fas fa-circle"></i></div>
                    <div className="number-reviews">{spot.numReviews + " review(s)"}</div>
                </div>
                <div className="box-right-data">
                    <div>
                        {!userAddRev.length && currentUser && (
                            <button className="create-review" onClick={handleReviewButton}>Create your Review</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="user-reviews">
                {reviews.map((review) => (
                    <div className="review-container" key={review.id}>
                        <div>
                            <div className="person">{review.User.firstName}</div>
                            {currentUser && currentUser.id === review.userId &&
                                <button className="delete-button" onClick={async (e) => {
                                    e.preventDefault(e);
                                    dispatch(deleteAReview(review.id));
                                    history.push('/')
                                }}>Delete your Review</button>
                            }
                        </div>
                        <div>Review by {review.User?.firstName}</div>
                        <div>Description: {review.review}</div>
                        <div>Stars: {<i className="fa-solid fa-star"></i>} {review.stars}</div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
};
export default reviewsSection;
