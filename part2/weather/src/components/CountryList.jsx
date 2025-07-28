import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import wdesc from './wdesc.json'; // adjust the path as needed


const Countryli =({country, handleShowCountry})=>{
    const handleOnClick = () => {
        handleShowCountry(country)
    }
    return (

        <li  >{country.name.common} <button onClick={handleOnClick}> show</button></li> 
    )
}

const Language = ({language}) => {
    return (<li>{language}</li>)
}

const Weather = ({weather})=>{
    console.log()
    if (!weather) return <p>Loading weather...</p>
    let wImg = wdesc[weather.weather_code].day
    if (weather.is_day != 1) {
        wImg =  wdesc[weather.weather_code].night
    }
    return (
        <div>
            <h2>Weather in {weather.name}</h2>
            <p>Temperature: {weather.temperature_2m}°C</p>
            <p>Wind Speed: {weather.wind_speed_10m} m/s</p>
            <img src={wImg.image} alt={wImg.description} ></img> 
        </div>
    )
}

const Country = ({country, handleUnshowCountry}) => {
    const [weather, setWeather] = useState(null)
    useEffect(()=>{
        axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${country.latlng[0]}&longitude=${country.latlng[1]}&current=is_day,temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=ms`)
        .then(response => {
            setWeather(response.data.current)
        })
    }, [])

    const flagStyles = {
        height : 120
    }
    return (
        <div>
            <button onClick={handleUnshowCountry}>unshow</button>
            <h2>{country.name.common}</h2>
            <p>
                Capital {country.capital.map(capit => `${capit} `)} <br></br>
                Area {country.area}
            </p>
            <h2>Languages</h2>
            <ul>
                {Object.entries(country.languages).map(([key, language])=> <Language key={key} language={language}/>)}
            </ul>
            <img src={country.flags.svg} alt={country.flags.alt} style={flagStyles}></img> <br></br>
            <Weather weather={weather}/>
        </div>
    )
}

const CountryList = ({countries, handleShowCountry, handleUnshowCountry}) => {
    
    if (countries.length == 1) {
        return (
            <Country country={countries[0]} handleUnshowCountry={handleUnshowCountry} />
        )
    }
    if (countries.length <= 10 )
        return (
            <ul>
            {countries.map(country => <Countryli 
                key={country.name.common} 
                country={country} 
                handleShowCountry={handleShowCountry}
                />)}
            </ul>
        )
    return (
        <p> Too many matches, sepcify another filter </p>
    )
}


export default CountryList