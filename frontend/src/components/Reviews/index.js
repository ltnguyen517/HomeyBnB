import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getAllReviews } from "../../store/reviews";
import { deleteAReview } from "../../store/reviews";
import './Reviews.css';

const ReviewsSection = ({ spot }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    let { spotId } = useParams();
    spotId = Number(spotId);

    const currentUser = useSelector((state) => state.session.user);
    const reviewsObj = useSelector((state) => state.reviews.spotReviews);
    const reviews = Object.values(reviewsObj);

    useEffect(() => {
        dispatch(getAllReviews(spotId));
    }, [dispatch, spotId]);

    const handleReviewButton = (e) => {
        e.preventDefault();
        history.push(`/spots/${spotId}/review`)
    };

    const userAddRev = reviews.filter((review) => {
        if(!currentUser){
            return [];
        } else {
            return review.userId === currentUser.id && review.spotId === spotId
        }
    });

    const averageRating = () => {
        let rating = 0;
        if(spot.avgStarRating === null) {
            return "New"
        } else {
            rating += spot.avgStarRating;
            return parseFloat(rating).toFixed(2)
        }
    };

    return (
        <>
        <div className="all-reviews-container">
            <div className="review-box-data">
                <div className="box-left-data">
                    <div className="review-star">
                        <i className="fa-solid fa-star"></i>
                        &nbsp;
                        {averageRating()}
                    </div>
                    <div className="little-dot">{<i className="fas fa-circle"></i>}</div>
                    <div className="number-reviews2">
                        {spot.numReviews === 1 ? spot.numReviews + " review" : spot.numReviews + " reviews"}
                        {/* {spot.numReviews + " review(s)"} */}
                    </div>
                </div>
                <div className="box-right-data">
                    <div>
                        {!userAddRev.length && currentUser && (
                            <button className="create-review" onClick={handleReviewButton}>Create Review</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="user-reviews">
                {reviews &&
                    reviews.map((review) => (
                        <div className="review-container" key={review.id}>
                            <div className="person-delete">
                                <div className="person">{review.User.firstName}</div>
                                {currentUser && currentUser.id === review.userId &&
                                    <button className="delete-button" onClick={async (e) => {
                                        e.preventDefault(e);
                                        dispatch(deleteAReview(review.id));
                                        history.push('/')
                                    }}>Delete Review</button>
                                }
                            </div>
                            <div>{review.review}</div>
                            &nbsp;
                            <div>Stars Given: {<i className="fa-solid fa-star"></i>} {review.stars}</div>
                        </div>
                ))}
            </div>
        </div>
    </>
    );
};
export default ReviewsSection;
