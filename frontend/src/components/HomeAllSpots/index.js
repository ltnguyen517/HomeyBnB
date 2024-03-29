import { getAllSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import "./HomeSpots.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";;


const HomeSpotsPage = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector((state) => state.spots.allSpots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    const handlePreviewImg = (e) => {
        e.target.src = "https://photos.zillowstatic.com/fp/991efe571b501b31dd1b9b40a303e995-uncropped_scaled_within_1536_1152.webp"
    }

    return (
        <div className="mainspot-container">
            {spots.map((spot) => (
                <div className="spot-container" key={spot.id}>
                    <div className="placeslayout">
                        <div className="eachspot-container">
                            <Link className="place-img" to={`/spots/${spot.id}`}>
                                <img className="spot-img" src={spot.previewImage || ""} onError={handlePreviewImg} alt='Home'></img>
                                <div className="vertexofcard-container">
                                    <div className="city-info">{spot.city + ", " + spot.state}</div>
                                    <div>
                                        <div className="spot-stars">
                                            <i className="fa-solid fa-star"></i>
                                            &nbsp;
                                            {spot.avgRating ? Number(spot.avgRating).toFixed(2) : 'New'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomofcard">
                                    <div className="card-price">{"$" + spot.price}</div>
                                    <div className="night-word">{"night"}</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default HomeSpotsPage;
