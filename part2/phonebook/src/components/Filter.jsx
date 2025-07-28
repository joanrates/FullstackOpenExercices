
const Filter = ({stateFilt, changeFilt}) =>{
    return (
      <div>
        <input value={stateFilt} onChange={changeFilt} />
      </div>
    )

}

export default Filter