
const PersonForm = ({handleSumbit, handleOnChangeName, handleOnChangePhone, stateNewName, stateNewPhone}) =>{
    return (
        <form onSubmit={handleSumbit}> 
            <div>
            name: <input value={stateNewName} onChange={handleOnChangeName}/>
            </div>
            <div>
            phone: <input value={stateNewPhone} type='tel' onChange={handleOnChangePhone}/>
            </div>
            <div>
            <button type="submit">add</button>
            </div>
      </form>
    )
}

export default PersonForm