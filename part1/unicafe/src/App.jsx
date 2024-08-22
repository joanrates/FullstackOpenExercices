import { useState } from 'react'
const Title = ({text}) => (
  <h1>{text}</h1>
)
const Button = ({clickHandler, text}) =>(
  <button onClick={clickHandler}>{text}</button>
)
const Display = ({text, state}) => (
  <div>
    {text} {state}
  </div>
)
const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handlerGen = (state, setState, text)=>{
    return ()=>{ 
      const newState = state +1
      setState(newState)
      console.log(text, "will be", newState)
    }
  }

  return (
    <div>
      <Title text={"Give us feedback"}/>
      <Button clickHandler={handlerGen(good,setGood,"good")} text={"good"}></Button>
      <Button clickHandler={handlerGen(neutral,setNeutral,"neutral")} text={"neutral"}></Button>
      <Button clickHandler={handlerGen(bad,setBad,"bad")} text={"bad"}></Button>
      <Title text={"statistics"}/>
      <Display text="good" state={good}/>
      <Display text="neutral" state={neutral}/>
      <Display text="bad" state={bad}/>
    </div>
  )
}

export default App