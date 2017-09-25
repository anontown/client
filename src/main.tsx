import "core-js";
import * as ReactDOM from 'react-dom';
import App from "./containers/app";
import * as React from 'react';
import { Provider } from 'react-redux';
import reducer from './reducers/reducer';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { epics } from './epics/app';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

const store = createStore(reducer, applyMiddleware(createEpicMiddleware(epics)))
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <Route path="/" component={App} />
            </MuiThemeProvider>
        </Router>
    </Provider>,
    document.querySelector('#root')
);
