import { connect } from 'react-redux'
import { Dispatch } from "redux";
import { ResWrite, ResWriteState } from '../components'
import {
  ResWriteActions,
  resWriteRequest
} from '../actions'
import { Store } from "../reducers";
import * as api from '@anontown/api-types'
import { DataClassFactory } from "data-class";

export interface ResWriteContainerProps {
  topic: string,
  reply: string | null
}

function mapStateToProps(state: Store, ownProps: ResWriteContainerProps): {
  profiles: api.Profile[];
  errors?: string[];
  mdEditorID: symbol;
} {
  if (state.user !== null) {
    const resWrite = state.resWrite.get(DataClassFactory(ownProps), null);
    if (resWrite !== null) {
      return {
        profiles: state.user.profiles.map(p => state.apiObject.profiles.get(p, null))
          .filter<api.Profile>((p): p is api.Profile => p !== null)
          .toArray(),
        errors: resWrite.errors,
        mdEditorID: resWrite.mdEditorID
      };
    } else {
      throw new Error();
    }
  } else {
    throw new Error();
  }
}

function mapDispatchToProps(dispatch: Dispatch<ResWriteActions>, ownProps: ResWriteContainerProps): {
  onSubmit?: (value: ResWriteState) => void;
} {
  return {
    onSubmit: (value: ResWriteState) => {
      dispatch(resWriteRequest(DataClassFactory(ownProps), value.name, value.profile, value.age))
    },
  }
}

export const ResWriteContainer = connect(mapStateToProps, mapDispatchToProps)(ResWrite);