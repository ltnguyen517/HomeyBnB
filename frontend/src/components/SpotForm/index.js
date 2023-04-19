import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNovelSpot } from "../../store/spots";
import { Redirect } from "react-router-dom";
import './SpotForm.css'

const SpotForm = () => {
    const dispatch = useDispatch();

    const [ address, setAddress ] = useState("");
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");
    const [ country, setCountry ] = useState("");
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ price, setPrice ] = useState(1);
    const [ previewImage, setPreviewImage ] = useState("");
    const [ validationErrors, setValidationErrors ] = useState([]);
    const [ uponCompletion, setUponCompletion ] = useState(false);

    const currentUser = useSelector(state => state.session.user);

    if(uponCompletion) return <Redirect to="/" />;

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

        const brandNewSpot = {
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
        const valErrs = validations();
        if(valErrs.length > 0) {
            setValidationErrors(valErrs)
            return;
        }

        return dispatch(createNovelSpot(brandNewSpot))
            .then(async(res) => {setUponCompletion(true)})
            .catch(async(res) => {
                const brandNewSpot = await res.json();
                if(brandNewSpot && brandNewSpot.errors) setValidationErrors(brandNewSpot.errors)
            })
    };

    return (
        <>
         <div className="complete-layout">
            <div className="spotcreation-form">
                <h1 className="spotform-header">Let's connect your home!</h1>
                <form className="spot-form" onSubmit={handleSubmit}>
                    <ul className="spot-form-errors">
                        {validationErrors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={address}
                            placeholder= 'Address'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={city}
                            placeholder= 'City'
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={state}
                            placeholder= 'State'
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={country}
                            placeholder= 'Country'
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={name}
                            placeholder= 'Name'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={description}
                            placeholder= 'Description'
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="number"
                            className="new-spot-data"
                            value={price}
                            min={1}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            className="new-spot-data"
                            value={previewImage}
                            placeholder= 'Place Image Address/URL Here'
                            onChange={(e) => setPreviewImage(e.target.value)}
                            required
                        />
                    </label>
                    <button className="spot-creation-button" type="submit">Create New Spot</button>
                </form>
            </div>
         </div>
        </>
    );
};
export default SpotForm;
