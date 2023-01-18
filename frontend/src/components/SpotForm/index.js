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
    const [ price, setPrice ] = useState(0);
    const [ previewImage, setPreviewImage ] = useState("");
    const [ validationErrors, setValidationErrors ] = useState([]);
    const [ uponCompletion, setUponCompletion ] = useState(false);
}
if(uponCompletion) return <Redirect to="/" />;

const currentUser = useSelector(state => state.session.user);

useEffect(() => {
    const errors = [];

    if(!currentUser) errors.push("Must be logged in for you to create a spot");
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

    const brandNewSpot = {
        address,
        city,
        state,
        country,
        name,
        description,
        price,
        lat: 120.25,
        lng: 75.89
    }
    const brandNewSpotImage = {
        url: previewImage,
        preview: true
    }

    return dispatch(createNovelSpot(brandNewSpot, brandNewSpotImage))
        .then(async(res) => {setUponCompletion(true)})
        .catch(async(res) => {
            const newSpot = await res.json();
            if(newSpot && newSpot.errors) setValidationErrors(newSpot.errors)
        })
}
