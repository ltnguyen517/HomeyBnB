import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getSpot, editASpot, deleteASpot } from "../../store/spots";
import { getAllReviews } from "../../store/reviews";
import ReviewsSection from "../Reviews";
import './ASpotDetailPage.css'

const SingleSpotDetails = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const singleSpot = useSelector((state) => state.spots.singleSpot);
    const currentUser = useSelector((state) => state.session.user);
    const [ validationErrors, setValidationErrors ] = useState([]);
    const reviewsObj = useSelector((state) => state.reviews.spotReviews);
    const reviews = Object.values(reviewsObj);
    const imageOfSpot = singleSpot.SpotImages;

    useEffect(() => {
        dispatch(getSpot(spotId));
        dispatch(getAllReviews(spotId));
    }, [dispatch, spotId]);

    const errors = [];

    const editButton = (e) => {
        e.preventDefault();
        if(!currentUser && currentUser.id !== singleSpot.ownerId){
            errors.push("Must be logged in and be the owner to edit this spot");
            setValidationErrors(errors);
        } else {
            dispatch(editASpot(spotId));
            history.push(`/spots/${singleSpot.id}/edit`)
        }
    };
    const deleteButton = (e) => {
        e.preventDefault();
        if(!currentUser && currentUser.id !== singleSpot.ownerId){
            errors.push("Must be logged in and be the owner to delete this spot");
            setValidationErrors(errors);
        } else {
            dispatch(deleteASpot(spotId));
            history.push("/")
        }
    }

    if(!imageOfSpot) return null;
    if(!reviews) return null;

    return (
        <div className="single-spot-page">
            <div className="spot-top-info-container">
                <div className="spot-name-container">
                    <h1 className="place-name">{singleSpot.name}</h1>
                    <div className="delete-edit-button-area">
                        <button className="button" onClick={editButton}> Edit your Spot</button>
                        <button className="button2" onClick={deleteButton}>Delete your Spot</button>
                    </div>
                </div>
                <div className="spot-info-top-beneath">
                    <div className="spot-data">
                        <div className="info-star-rating">
                            <i className="fa-solid fa-star"></i>
                            {singleSpot.avgRating}
                        </div>
                        <div className="little-dot">
                            <i className="fas fa-circle"></i>
                        </div>
                        <div className="number-reviews">
                            {singleSpot.numReviews + " review(s)"}
                        </div>
                        <div className="little-dot">
                            <i className="fas fa-circle"></i>
                        </div>
                        <div className="superhost-medal">
                            <i className="fa-solid fa-medal"></i>
                        </div>
                        <div className="superhost-text">Superhost</div>
                        <div className="little-dot">
                            <i className="fas fa-circle"></i>
                        </div>
                        <div className="location">
                            {singleSpot.city}, {singleSpot.state}, {singleSpot.country}
                        </div>
                    </div>
                </div>
            </div>
            <div className="images-container">
                {imageOfSpot.map((spotImage) => (
                    <div key={spotImage.id}>
                        <img className="the-spot-image" src={spotImage.previewImage || "https://a0.muscache.com/im/pictures/323b2430-a7fa-44d7-ba7a-6776d8e682df.jpg?im_w=1440"} alt='Spot Img'></img>
                    </div>
                ))}
            </div>
            <div className="below-images-info">
                <div className="stay-hosted-by">
                    <h2 className="stay-hosted-by-text">Entire home hosted by {singleSpot.Owner?.firstName}</h2>
                    <div className="nightly-price">
                        <h2 className="price">${singleSpot.price}</h2>
                        <div className="night-text">night</div>
                    </div>
                </div>
                <div className="amount-info">
                    <div className="amount-data">10 guests</div>
                    <div className="little-dot"><i className="fas fa-circle"></i></div>
                    <div className="amount-data">4 bedrooms</div>
                    <div className="little-dot"><i className="fas fa-circle"></i></div>
                    <div className="amount-data">5 beds</div>
                    <div className="little-dot"><i className="fas fa-circle"></i></div>
                    <div className="amount-data">3.5 baths</div>
                </div>
                <div className="three-pros">
                    <div className="pros-icons">
                        <div><i className="fa-solid fa-house-laptop"></i></div>
                        <div><i className="fa-solid fa-door-open"></i></div>
                        <div><i className="fa-regular fa-calendar"></i></div>
                    </div>
                    <div className="pros-short-descriptions">
                        <h3>Great for remote work</h3>
                        <div className="details">Fast wifi at 285 Mbps, plus a dedicated workspace in a private room.</div>
                        <div className="check-in">
                            <h3>Self check-in</h3>
                            <div className="details">Check yourself in with the lockbox.</div>
                        </div>
                        <div className="superhost">
                            <h3>{singleSpot.Owner.firstName} is a Superhost</h3>
                            <div className="details">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="aircover">
                <h2 style={{ color: '#ff375c', fontSize: '32px', marginLeft: '-20px' }}>air<span style={{ color: '#222' }}>cover</span></h2>
                <p className="aircover-description">Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.</p>
            </div>
            <div className="about-box">
                <div>{singleSpot.description}</div>
            </div>
            <div className="reviews-area">
                <ReviewsSection spot={singleSpot} />
            </div>
        </div>
    )
}
export default SingleSpotDetails;
