import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './ScreenHome';
import ArticlesBySource from './ScreenArticlesBySource';
import MyArticles from './ScreenMyArticles';
import Sources from './ScreenSource';

import wishlist from './reducers/article'; // Import tableau d'articles wishlist depuis redux
import token from './reducers/token'; // Import token depuis redux
import country from './reducers/country'; // Import country depuis redux
import {Provider} from 'react-redux'; // Import provider
import {createStore, combineReducers}  from 'redux'; // Import store

const store = createStore(combineReducers({wishlist, token, country})); // Enregistrement des Reduceurs dans le Store

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/articlesbysource/:id" component={ArticlesBySource} />
          <Route path="/myarticles" component={MyArticles} />
          <Route path="/sources" component={Sources} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
