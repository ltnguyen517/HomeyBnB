import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { createAReview } from "../../store/reviews";
import './CreateReviewForm.css';

const ReviewForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const currentUser = useSelector((state) => state.session.user);
    const [ stars, setStars ] = useState("");
    const [ review, setReview ] = useState("");
    const [ errors, setErrors ] = useState([]);

    useEffect(() => {
        const errors = [];
        if(!currentUser) errors.push('Must be logged in to create a review');

        if(review.length < 1) errors.push('Please type a review with greater than 1 character');
        if(stars < 1 || stars > 5 || !Number(stars)) errors.push('Please enter a star rating that is between 1 and 5');

        setErrors(errors);
    }, [currentUser, review, stars]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            review,
            stars
        };
        let aNewReview = await dispatch(createAReview(newReview, spotId));
        if(aNewReview) history.push(`/spots/${spotId}`);
    };

    return (
        <div className="whole-review-form">
            <form className="review-form" onSubmit={handleSubmit}>
                <h1 className="review-form-title">Let's post a review!</h1>
                <ul className="form-errors">{errors.map((error) => (
                    <li key={error}>{error}</li>
                ))}
                </ul>
                <label className="review-form-data-placement">
                    <input
                        type="text"
                        value={review}
                        placeholder='Review'
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        value={stars}
                        placeholder='Stars'
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                </label>
                <button className="submit-review-button" type="submit">Post New Review</button>
            </form>
        </div>
    )
};
export default ReviewForm;
