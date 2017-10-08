import { connect as reduxConnect } from 'react-redux'
import { Dispatch } from "redux";
import { Store } from "../reducers";
import { Actions } from '../actions'
import { ComponentType } from "react";

export function connect<TOwnProps, TProps>(fn: (state: Store, dispatch: Dispatch<Actions>, ownProp: TOwnProps) => TProps, component: ComponentType<TProps>): ComponentType<TOwnProps> {
  return reduxConnect((state: Store) => state,
    (dispatch: Dispatch<Actions>) => ({ dispatch }),
    (state, { dispatch }, ownProps: TOwnProps) => fn(state, dispatch, ownProps)
  )(component);
}