import { useState } from 'react'
const Title = ({text}) => (
  <h1>{text}</h1>
)
const Button = ({clickHandler, text}) =>(
  <button onClick={clickHandler}>{text}</button>
)
const StatisticLine = ({text, value}) =>(
  <tr>
    <td>{text}</td> 
    <td>{value}</td>
    </tr>
)
const Statistics = ({good, neutral, bad, avg, posperc}) => {
  if (good+neutral+bad === 0){
    return (
      <div>
        No feedback given
      </div>
    )
  } else 
    return(
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="average" value={avg}/>
          <StatisticLine text="positive" value={posperc+" %"}/>
        </tbody>
      </table> 
    )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [avg, setAvg] = useState(0)
  const [posperc, setPosperc] = useState(0)
  const handlerGen = (state, setState, text)=>{
    return ()=>{ 
      const newState = state +1
      setState(newState)
      refreshAvg(text)
    }
  }
  const refreshAvg = (text) => {
    let modifyer = 0
    if(text === "good") modifyer = 1
    setPosperc((good+modifyer)/(good+neutral+bad+1)*100)
    if ( text === "bad") modifyer = -1
    setAvg((good-bad+modifyer)/(good+neutral+bad+1))
  }
  return (
    <div>
      <Title text={"Give us feedback"}/>
      <Button clickHandler={handlerGen(good,setGood,"good")} text={"good"}></Button>
      <Button clickHandler={handlerGen(neutral,setNeutral,"neutral")} text={"neutral"}></Button>
      <Button clickHandler={handlerGen(bad,setBad,"bad")} text={"bad"}></Button>
      <Title text={"statistics"}/>
      <Statistics good={good} neutral={neutral} bad={bad} avg={avg} posperc={posperc}/>
    </div>
  )
}

export default App