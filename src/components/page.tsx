import * as React from "react";
import * as style from "./page.scss";

export interface PageProps {
  sidebar?: React.ReactNode;
  disableScroll?: boolean;
}

interface PageState {
}

export class Page extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
  }
  render() {
    return (
      <div style={{
        height:"100%"
      }} className={this.props.sidebar !== undefined ? style.two : undefined}>
        {this.props.sidebar !== undefined
          ? <aside>
            {this.props.sidebar}
          </aside>
          : null}
        <main
          style={{
            height:"100%"
          }}
          className={!this.props.disableScroll ? style.mainScroll : undefined}>
          {this.props.children}
        </main>
      </div>
    );
  }

}
