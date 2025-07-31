import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import InfoMessage from './components/InfoMessage'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newNameFilter, setNewNameFilter] = useState('')
  const [Message, setMessage] = useState({text: '', type: ''});

  useEffect(()=>{
    personsService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons);
      })
  },[])
  
  

  const handleOnChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleOnChangePhone = (event) =>{
    setNewPhone(event.target.value)
  }

  const handleOnChangeNameFilter = (event) => {
    setNewNameFilter(event.target.value)
  }

  const handleSumbit = (event) => {
    event.preventDefault();
    if (newName.trim() === '') return;

    const personObj = {
      name: newName.trim(),
      number: newPhone
    };

    // Always fetch latest persons to avoid race conditions
    personsService.getAll().then(allPersons => {
      const existing = allPersons.find(
        person => person.name.trim().toLowerCase() === newName.trim().toLowerCase()
      );

      if (existing) {
        if (window.confirm(`${newName} is already a person, do you want to replace the old number with the new one?`)) {
          personsService
            .update({ ...existing, number: newPhone })
            .then(updatedPerson => {
              setPersons(allPersons.map(p => p.id === existing.id ? updatedPerson : p));
              setMessage({ text: `Modified ${personObj.name}`, type: 'normal' });
              setTimeout(() => {
                setMessage({ text: '', type: '' });
              }, 5000);
            })
            .catch(error => {
              setMessage({ text: `Information of ${existing.name} has already been removed from server`, type: 'bad' });
              setTimeout(() => {
                setMessage({ text: '', type: '' });
              }, 5000);
              setPersons(allPersons.filter(person => person.id !== existing.id));
            })
            .finally(() => {
              setNewName('');
              setNewPhone('');
            });
        }
        return;
      }
      
      
      // If not existing, create new
      if (persons.find(person => person.name.trim().toLowerCase() === newName.trim().toLowerCase())){
        setMessage({ text: `Information of ${newName} has already been removed from server`, type: 'bad' });
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 5000);
        setPersons(allPersons.filter(person => person.id !== personObj.id));
        return;
      }

      personsService
        .create(personObj)
        .then(createdPers => {
          setPersons(allPersons.concat(createdPers));
          setMessage({ text: `Added ${personObj.name}`, type: 'normal' });
          setTimeout(() => {
            setMessage({ text: '', type: '' });
          }, 5000);
        })
        .catch(error => {
          setMessage({ text: `Failed to add ${personObj.name}`, type: 'bad' });
          setTimeout(() => {
            setMessage({ text: '', type: '' });
          }, 5000);
        })
        .finally(() => {
          setNewName('');
          setNewPhone('');
        });
    });
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      personsService
        .elim(id)
        .then(() => {
          setMessage({text: `Information of ${persons.find(p => p.id === id).name} has correctly been removed from server`, type: 'normal'});
          setTimeout(() => {
            setMessage({text: '', type: ''});
          }, 5000);
          setPersons(persons.filter(person => person.id !== id));
          })
        .catch(error => {
          setMessage({text: `Information of ${persons.find(p => p.id === id).name} has already been removed from server`, type: 'bad'});
          setTimeout(() => {
            setMessage({text: '', type: ''});
          }, 5000);
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
        <InfoMessage message={Message.text} mtype={Message.type} />
        <Filter stateFilt={newNameFilter} changeFilt={handleOnChangeNameFilter}/>
      <h2>Add new</h2>
        <PersonForm 
          stateNewName={newName} 
          stateNewPhone={newPhone} 
          handleSumbit={handleSumbit}
          handleOnChangeName={handleOnChangeName}
          handleOnChangePhone={handleOnChangePhone}
        />
      <h2>Numbers</h2>
        <Persons persons={persons} nameFilter={newNameFilter} handleDelete={handleDelete} />
      {/* <div>debug: {newName}</div> */}
    </div>
  )
}

export default App