import "core-js";
import * as ReactDOM from 'react-dom';
import { App } from "./components/app";
import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { logger } from 'redux-logger'
import { Provider } from 'react-redux';
import { reducer } from './reducers';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(reducer, applyMiddleware(logger));

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <Route path="/" component={App} />
            </MuiThemeProvider>
        </Provider>
    </BrowserRouter>,
    document.querySelector('#root')
);
