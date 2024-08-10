const Header = (props) => {
  return(
    <>
      <h1>{props.course}</h1> 
    </>
  )
}
const Part = (props) => {
  return(
    <>
      <p>{props.part.part} {props.part.exercices} </p>
    </>
  )

}
const Content = (props) => {
  return(
    <>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]} />
      <Part part={props.parts[2]} />
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercices {props.parts[0].exercices + props.parts[1].exercices + props.parts[2].exercices}</p>
    </>
  )

}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts = [
    {part: part1, exercices: exercises1},
    {part: part2, exercices: exercises2},
    {part: part3, exercices: exercises3}, 
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App