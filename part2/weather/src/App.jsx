import React from "react"
import { useState, useEffect } from "react"
import Finder from "./components/Finder"
import axios from "axios"
import CountryList from "./components/CountryList"


function App() {
  const [newCountryName, setNewCountryName] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [countries, setCountries] = useState([])
  useEffect(()=>{
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        setAllCountries(response.data);
        setCountries(response.data.filter(country => country.name.common.trim().toLowerCase().includes(newCountryName)))
      })
  }, [])

  const handleChangeCountryName = (event)=>{
    setNewCountryName(event.target.value)
    if (event.target.value !== '')
      setCountries(allCountries.filter(country => country.name.common.trim().toLowerCase().includes(event.target.value)))
  }

  const handleShowCountry = (showncount) => {
    setCountries(allCountries.filter(country => country.name.common.trim().toLowerCase() === showncount.name.common.trim().toLowerCase()))
  }

  const handleUnshowCountry = () => {
    setCountries(allCountries.filter(country => country.name.common.trim().toLowerCase().includes(newCountryName)))
  }

  return (
    <>
      <Finder newCountryName={newCountryName} handleChangeCountryName={handleChangeCountryName}/>
      <div>
        <CountryList countries={countries} handleShowCountry={handleShowCountry} handleUnshowCountry={handleUnshowCountry}/>
      </div>
    </>
  )
}

export default App
