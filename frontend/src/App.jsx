import {Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Chats from './components/Chats'
import './App.css'
function App() {
  return (
    < >
      <div className='App'>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/chats' element={<Chats/>}></Route>
      </Routes>
      </div>
    </>
  )
}

export default App
