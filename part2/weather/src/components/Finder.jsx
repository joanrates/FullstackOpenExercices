import React from "react"

const Finder = ({newCountryName, handleChangeCountryName}) => {
    return (
        <div>
            find countries: 
            <input value={newCountryName} onChange={handleChangeCountryName} />
        </div>
    )
}

export default Finder