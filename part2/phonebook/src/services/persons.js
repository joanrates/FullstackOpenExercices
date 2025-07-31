import axios from "axios";

const baseUrl = '/api/persons'
const getAll = () =>{
  return axios
    .get(baseUrl)
    .then(response => response.data)
}


const create = (persObj) =>{
    getAll()
    .then((allPersons)=>{
        if (allPersons.find(person=> person.name === persObj.name.trim())){
            return update(persObj)
        }
    })

    return axios
        .post(baseUrl, persObj)
        .then(response => response.data)
}

const elim = (persId) => {
    return axios
        .delete(`${baseUrl}/${persId}`)
        .then(response=>response.data)
}

const update = (newPerson)=>{
    return axios
        .put(`${baseUrl}/${newPerson.id}`, newPerson)
        .then(response => response.data)
}
export default {getAll, create, elim, update}