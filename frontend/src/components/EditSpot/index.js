import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editASpot } from "../../store/spots";
import './EditSpot.css'

const SpotEditing = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const spotUpdate = useSelector((state) => state.spots.singleSpot);
    const currentUser = useSelector((state) => state.session.user);

    let { spotId } = useParams();
    spotId = Number(spotId);

    const [ address, setAddress ] = useState(spotUpdate?.address);
    const [ city, setCity ] = useState(spotUpdate?.city);
    const [ state, setState ] = useState(spotUpdate?.state);
    const [ country, setCountry ] = useState(spotUpdate?.country);
    const [ name, setName ] = useState(spotUpdate?.name);
    const [ description, setDescription ] = useState(spotUpdate?.description);
    const [ price, setPrice ] = useState(spotUpdate?.price);
    const [ previewImage, setPreviewImage ] = useState("");
    const [ validationErrors, setValidationErrors ] = useState([]);

    const validations = () => {
        const errors = [];

        if(!currentUser) errors.push("Must be logged in for you to edit your spot");
        if(address.length < 4) errors.push("Please enter a street address with a length greater than 3 characters");
        if(city.length < 3) errors.push("Please enter a city with a length greater than 2 characters");
        if(state.length < 2) errors.push("Please enter a state with a length greater than 1 character");
        if(country.length < 2) errors.push("Please enter a country with a length greater than 1 character");
        if(name.length < 5) errors.push("Please enter a name longer than 4 characters. It is required");
        if(description.length < 10) errors.push("Please enter a valid description longer than 9 characters. It is required");
        if(price < 1) errors.push("Please enter a price greater than $0");
        if(!previewImage) errors.push("Please enter a valid image URL");

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors([]);

        const updateSpot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat: 120.25,
            lng: 75.89,
            previewImage
        };
        const valErrs = validations();
        if(valErrs.length > 0) {
            setValidationErrors(valErrs)
            return
        }
        return dispatch(editASpot(spotId, updateSpot))
            .then(async(res) => {history.push(`/spots/${spotId}`)})
            .catch(async(res) => {
                const data = await res.json();
                if(data && data.errors) setValidationErrors(data.errors)
            })
    };

    return (
        <>
         <div className="complete-edit-layout">
            <div className="spotedit-webpage">
                <h1 className="spotedit-header">Let's edit your spot!</h1>
                <form className="spotedit-form" onSubmit={handleSubmit}>
                    <ul className="spot-edit-errors">
                        {validationErrors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={address}
                            placeholder= 'Address'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={city}
                            placeholder= 'City'
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={state}
                            placeholder= 'State'
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={country}
                            placeholder= 'Country'
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={name}
                            placeholder= 'Name'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={description}
                            placeholder= 'Description'
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="number"
                            className="dataeditspot"
                            value={price}
                            min={1}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="dataeditspot"
                            value={previewImage}
                            placeholder= 'Place Image Address/URL Here'
                            onChange={(e) => setPreviewImage(e.target.value)}
                            required
                        />
                    </label>
                    <button className="spot-edit-button" type="submit">Update Spot Now</button>
                </form>
            </div>
         </div>
        </>
    );
};
export default SpotEditing;
