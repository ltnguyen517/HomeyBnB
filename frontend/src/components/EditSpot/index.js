import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { editASpot } from "../../store/spots";
import './EditSpot.css'

const SpotEditing = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const spotUpdate = useSelector((state) => state.spots.singleSpot)
    const currentUser = useSelector((state) => state.session.user);
    const [ address, setAddress ] = useState(spotUpdate.address);
    const [ city, setCity ] = useState(spotUpdate.city);
    const [ state, setState ] = useState(spotUpdate.state);
    const [ country, setCountry ] = useState(spotUpdate.country);
    const [ name, setName ] = useState(spotUpdate.name);
    const [ description, setDescription ] = useState(spotUpdate.description);
    const [ price, setPrice ] = useState(spotUpdate.price);
    const [ previewImage, setPreviewImage ] = useState("");
    const [ validationErrors, setValidationErrors ] = useState([]);

    useEffect(() => {
        const errors = [];

        if(!currentUser) errors.push("Must be logged in for you to edit your spot");
        if(address.length === 0) errors.push("Please enter a valid street address");
        if(city.length === 0) errors.push("Please enter a valid city");
        if(state.length === 0) errors.push("Please enter a valid state");
        if(country.length === 0) errors.push("Please enter a valid country");
        if(name.length === 0) errors.push("Please enter a name. It is required");
        if(description.length === 0) errors.push("Please enter a valid description. It is required");
        if(price < 0) errors.push("Please enter a price greater than or equal to 0");
        if(!previewImage) errors.push("Please enter a valid image URL");

        setValidationErrors(errors);
    }, [currentUser, address, city, state, country, name, description, price, previewImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors([]);

        const infoWithUpdates = {
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
        }

        return dispatch(editASpot(updateSpot, id))
            .then(async(res) => {history.push(`/spots/${id}`)})
            .catch(async(res) => {
                const updatedSpot = await res.json();
                if(updatedSpot && updatedSpot.errors) setValidationErrors(updatedSpot.errors)
            })
    };

    return (
        <>
         <div className="complete-edit-layout">
            <div className="spotedit-webpage">
                <h1 className="spotedit-header">Let's edit your spot!</h1>
                <form className="spotedit-form" onSubmit={handleSubmit}>
                    <ul className="spot-edit-errors">
                        {validationErrors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                    <label>
                        <input
                            type="text"
                            value={address}
                            placeholder= 'Address'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            value={city}
                            placeholder= 'City'
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            value={state}
                            placeholder= 'State'
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            value={country}
                            placeholder= 'Country'
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            value={name}
                            placeholder= 'Name'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            value={description}
                            placeholder= 'Description'
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="number"
                            value={price}
                            placeholder= 'Price'
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            value={previewImage}
                            placeholder= 'Img url'
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
