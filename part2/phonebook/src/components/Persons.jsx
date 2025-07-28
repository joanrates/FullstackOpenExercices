import personsService from "../services/persons"


const Contact = ({contact, handleDelete}) =>{
  return (
    <>
      {contact.name} {contact.number} <button onClick={()=>handleDelete(contact.id)}>delete</button>
      <br></br>
    </>
  )
}


const Persons = ({persons, nameFilter, handleDelete}) =>{
    const personsToShow = persons.filter((person) => person.name.includes(nameFilter))
    return (
        <div>
        {personsToShow.map((person) =>{
                return <Contact contact={person} handleDelete={handleDelete} key={person.id}/>
            } 
        )}
        </div>
    )
}

export default Persons