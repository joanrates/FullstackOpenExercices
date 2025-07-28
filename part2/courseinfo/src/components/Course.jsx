import React from "react"

const Header = (props) => {
  return(
    <>
      <h1>{props.course.name}</h1> 
    </>
  )
}
const Part = (props) => {
  return(
    <>
      <p>{props.part.name} {props.part.exercises} </p>
    </>
  )

}
const Content = (props) => {
  
  return(
    <>
      {props.course.parts.map(part =>{
        return (
          <Part part={part} key={part.id} />
        )
      })}
      
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p><b> Total of exercices {props.course.parts.reduce((acc, part)=> acc + part.exercises, 0)} </b></p>
    </>
  )

}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )

}

export default Course