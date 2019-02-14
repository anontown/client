import * as React from "react";
import { UserData } from "src/models";
import { Omit } from "type-zoo";
import { UserContext } from "./user";

export function userSwitch<P extends { userData: UserData, updateUserData: (value: UserData | null) => void }>(Children: React.ComponentType<P>)
    : React.ComponentType<Omit<P, "userData" | "updateUserData">> {
    return (props: Omit<P, "userData" | "updateUserData">) => {
        return <UserContext.Consumer>
            {val => val.value !== null
                ? <Children {...props as any} userData={val.value} updateUserData={val.update} />
                : <div>ログインして下さい</div>}
        </UserContext.Consumer>;
    };
}
