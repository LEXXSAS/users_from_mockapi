import React from 'react'
import { useState } from 'react';
import Usermockapi from './pages/Usermockapi';
import Loginpage from './pages/Loginpage';
import NotFound from './pages/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppContext } from './components/context';

function App() {
  const [localEmail, setLocalEmail] = useState('');

  return (
    <AppContext.Provider value={{localEmail, setLocalEmail}} >
    <div className='App'>
      <div className='container'>
      <Routes>
        <Route>
          <Route path='/' element={<Loginpage />} />
          <Route path='/usermockapi' element={<Usermockapi />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='*' element={<Navigate to="/not-found" />} />
        </Route>
      </Routes>
      </div>
    </div>
    </AppContext.Provider>
  );
}

export default App;
