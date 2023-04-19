import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './new.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navheader'>
      <ul className='nav-push'>
        <li>
          <NavLink exact to="/">
            <img className='homelogoicon' src={logo} alt='HomeyBnB logo'></img>
          </NavLink>
        </li>
        {isLoaded && (
          <li className='prof-button'>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
