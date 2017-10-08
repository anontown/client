import { Dispatch } from "redux";
import { Res, ResProps } from '../components'
import {
  Actions,
  resDeleteRequest,
  resUVRequest,
  resDVRequest,
  resCVRequest,
  resHashRequest,
  resReplyRquest,
  resSendRquest
} from '../actions'
import { Store } from "../reducers";
import * as React from "react";
import { connect } from "../utils";
import { ResTree } from "../models";

export interface ResContainerProps {
  id: symbol
}

export const ResContainer = connect<ResContainerProps, ResProps>((state, dispatch, ownProps) => {
  const comp = state.res.get(ownProps.id)!;
  const res = state.apiObject.reses.get(comp.id)!;
  const resTreeNode =
    res.type === 'normal' ? { ...res, ...{ profile: res.profile !== null ? state.apiObject.profiles.get(res.profile)! : null } } :
      res.type === 'history' ? { ...res, ...{ history: state.apiObject.histories.get(res.history)! } } :
        res.type === 'topic' ? { ...res, ...{ topicObject: state.apiObject.topics.get(res.topic)! } } :
          res.type === 'fork' ? { ...res, ...{ fork: state.apiObject.topics.get(res.fork)! } } :
            res;
  const resTree: ResTree = {
    ...resTreeNode, children: comp.children !== null ? { msg: comp.children.msg, ids: comp.children.reses.toArray() } : null
  };

  return {
    res: resTree,
    user: state.user !== null ? { token: state.user.token, profiles: state.user.profiles.map(p => state.apiObject.profiles.get(p)!).toArray() } : null,
    onDeleteClick: () => {
      dispatch(resDeleteRequest(ownProps.id));
    },
    onUVClick: () => {
      switch (res.voteFlag) {
        case "uv":
          dispatch(resCVRequest(ownProps.id));
          break;
        case "dv":
          dispatch(resCVRequest(ownProps.id));
          dispatch(resUVRequest(ownProps.id));
          break;
        case "not":
          dispatch(resUVRequest(ownProps.id));
          break;
      }
    },
    onDVClick: () => {
      switch (res.voteFlag) {
        case "dv":
          dispatch(resCVRequest(ownProps.id));
          break;
        case "uv":
          dispatch(resCVRequest(ownProps.id));
          dispatch(resDVRequest(ownProps.id));
          break;
        case "not":
          dispatch(resDVRequest(ownProps.id));
          break;
      }
    },
    onProfileClick: () => {
    },
    onHashClick: () => {

    },
    onReplyClick: () => {

    },
    onSendClick: () => {

    }
  };
}, Res);