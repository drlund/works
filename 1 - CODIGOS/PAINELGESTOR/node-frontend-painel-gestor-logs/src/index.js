import React from 'react';
import { render } from "react-dom";
// import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import combineReducers from 'services/reducers';
import App from './App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);


// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(
//   <Provider store={store}>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </Provider>
// );

const container = document.getElementById("root");
render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
  , container
);

if (process.env.NODE_ENV === 'development') {
  import('./loadDevSuper').then(({ loadDevSuper }) => loadDevSuper(store));
}
