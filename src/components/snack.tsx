import * as React from 'react';
import {
  Snackbar
} from 'material-ui';

export function Snack(props: { msg: string | null, onHide?: () => void }) {
  return (<Snackbar
    open={props.msg !== null}
    message={props.msg}
    autoHideDuration={5000}
    onRequestClose={() => {
      if (props.onHide) {
        props.onHide();
      }
    }} />)
}