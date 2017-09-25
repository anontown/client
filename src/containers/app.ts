import { connect } from 'react-redux'
import { Dispatch } from "redux";
import App from '../components/app'
import { inc, dec } from '../actions/app'
import { Actions } from "../actions/type";
import { Store } from "../store";

function mapStateToProps(state: Store) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onIncClick: () => { dispatch(inc()) },
    onDecClick: () => { dispatch(dec()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)