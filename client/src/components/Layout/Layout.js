import React, { useEffect, useState } from 'react';

import Header from './Header/Header';
import Footer from './Footer/Footer';

import { useAuth } from '../../contexts/userContext';

const Layout = (props) => {
  const { state } = useAuth();
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    if (state.jwt !== '') {
      setIsLogged(true);
    } else setIsLogged(false);
  }, [state.jwt]);
  return (
    <>
      {isLogged ? (
        <div>
          <Header />
          <main>
            <div className='section'>{props.children}</div>
          </main>
        </div>
      ) : (
        <div>
          <Header />
          <main>
            <div>{props.children}</div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Layout;
