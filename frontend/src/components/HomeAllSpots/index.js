import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";;
import { getAllSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import "./HomeSpots.css";

const HomeSpotsPage = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector((state) => state.spots.allSpots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
        <div className="mainspot-container">
            {spots.map((spot) => (
                <div className="spot-container" key={spot.id}>
                    <SpotCard spot={spot} />
                </div>
            ))}
        </div>
    );
};
export default HomeSpotsPage
