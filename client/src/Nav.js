import React from 'react';
import './App.css';
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Nav(props) {

  // RETURN PRINCIPAL
  return (
    <nav >
      <Menu style={{textAlign: 'center'}} mode="horizontal" theme="dark">

        <Menu.Item key="mail">
          <Link to="/sources"><Icon type="home"/>Sources</Link>
        </Menu.Item>

        <Menu.Item key="test">
          <Link to="/myarticles"><Icon type="read" />My articles</Link>
        </Menu.Item>

        <Menu.Item key="app">
          <Link to="/" onClick={()=>props.deleteToken()}><Icon type="logout" />Logout</Link>
        </Menu.Item>

      </Menu>
    </nav>
  );
}


// Composant conteneur pour redux
function mapDispatchToProps(dispatch) {
  return {
    deleteToken: function() { // Fonction accessible en tant que propriété
        dispatch( {type: 'deleteToken'} ) // Initialisation de l'action
    }
  }
}


// EXPORT
export default connect(
  null, 
  mapDispatchToProps
)(Nav);
