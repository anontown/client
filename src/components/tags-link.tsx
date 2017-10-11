import * as React from 'react';
import { Link } from "react-router-dom";

export interface TagsLinkProps {
  tags: string[]
}

export function TagsLink(props: TagsLinkProps) {
  return <Link to={{ pathname: "/topic/search", search: new URLSearchParams({ tags: props.tags.join(' ') }).toString() }}>
    {props.tags.length !== 0 ? props.tags.join(',') : '(なし)'}
  </Link>
}