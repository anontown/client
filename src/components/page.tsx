import * as React from "react";
import * as style from "./page.scss";

export interface PageProps {
  sidebar?: React.ReactNode;
}

interface PageState {
}

export class Page extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
  }
  render() {
    return (
      <div className={this.props.sidebar !== undefined ? style.two : undefined}>
        {this.props.sidebar !== undefined
          ? <aside>
            {this.props.sidebar}
          </aside>
          : null}
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }

}
