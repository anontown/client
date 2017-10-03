import "core-js";
import * as ReactDOM from 'react-dom';
import App from "./containers/app";
import * as React from 'react';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { epics } from './epics';
import { BrowserRouter, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { logger } from 'redux-logger'


const store = createStore(reducer, applyMiddleware(createEpicMiddleware(epics), logger));

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <Route path="/" component={App} />
            </MuiThemeProvider>
        </Provider>
    </BrowserRouter>,
    document.querySelector('#root')
);
