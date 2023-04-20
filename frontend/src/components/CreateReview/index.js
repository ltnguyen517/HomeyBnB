import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import { createAReview } from "../../store/reviews";
import './CreateReviewForm.css';

const ReviewForm = () => {
    const dispatch = useDispatch();
    let { spotId } = useParams();
    spotId = Number(spotId);
    const currentUser = useSelector((state) => state.session.user);
    const [ stars, setStars ] = useState("");
    const [ review, setReview ] = useState("");
    const [ errors, setErrors ] = useState([]);
    const [ submit, setSubmit ] = useState(false);

    if(submit) return <Redirect to={`/spots/${spotId}`} />

    // useEffect(() => {
    //     const errors = [];

    //     if(!currentUser) errors.push('Must be logged in to create a review');

    //     if(review.length < 1) errors.push('Please type a review with greater than 1 character');
    //     if(stars < 1 || stars > 5 || !Number(stars)) errors.push('Please enter a star rating that is between 1 and 5');

    //     setErrors(errors);
    // }, [currentUser, review, stars]);

    const validations = () => {
        const errors = [];

        if(!currentUser) errors.push('Must be logged in to create a review');
        if(review.length < 10) errors.push('Please make a review with at least 10 characters');
        if(stars < 1 || stars > 5 || !Number(stars)) errors.push('Please enter a star rating that is between 1 and 5');
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newReview = {
            review,
            stars
        };

        const valErrs = validations();
        if(valErrs.length){
            setErrors(valErrs);
            return;
        }

        return dispatch(createAReview(spotId, newReview)).then(async (res) => {
            setSubmit(true);
        });
    };

    return (
        <div className="whole-review-form">
            <form className="review-form" onSubmit={handleSubmit}>
                <h1 className="review-form-title">Let's post a review!</h1>
                <ul className="form-errors">{errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
                </ul>
                <label className="review-form-data-placement">
                    <input
                        type="text"
                        className="data"
                        value={review}
                        placeholder=' Reviews must be at least 10 characters long'
                        onChange={(e) => setReview(e.target.value)}
                        required
                    >
                    </input>
                    <input
                        type="number"
                        className="data2"
                        value={stars}
                        placeholder=' Stars'
                        min={1}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    >
                    </input>
                </label>
                <button className="submit-review-button" type="submit">Post New Review</button>
            </form>
        </div>
    )
};
export default ReviewForm;
