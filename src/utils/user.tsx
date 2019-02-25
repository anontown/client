import * as React from "react";
import { UserData } from "src/models";
import * as rx from "rxjs";
import * as op from "rxjs/operators";
import { useEffectSkipN } from "./use-effect-skip-n";

export interface UserContextType {
  value: UserData | null,
  update: (value: UserData | null) => void
}

export const UserContext = React.createContext<UserContextType>({
  value: null,
  update: () => { }
});

export function useUserContext() {
  return React.useContext(UserContext);
}

export interface UserProps {
  children: React.ReactNode,
  initUserData: UserData | null,
}

export const User = (props: UserProps) => {
  const [userData, setUserData] = React.useState(props.initUserData);
  const subjectRef = React.useRef(new rx.Subject<UserData | null>());
  useEffectSkipN(() => {
    subjectRef.current.next(userData);
  }, [userData]);
  React.useEffect(() => {
    const subs = subjectRef
      .current
      .pipe(op.debounceTime(5000))
      .subscribe(data => {
        if (data !== null) {
          storageAPI
            .save(data.token, data.storage);
        }
      });

    return () => {
      subs.unsubscribe();
    };
  }, []);

  useEffectSkipN(() => {
    if (userData !== null) {
      localStorage.setItem("token", JSON.stringify({
        id: userData.token.id,
        key: userData.token.key,
      }));
    } else {
      localStorage.removeItem("token");
    }
  }, [userData !== null ? userData.token.id : null]);

  useEffectSkipN(() => {
    location.reload();
  }, [userData !== null ? userData.id : null]);

  return (
    <UserContext.Provider
      value={{
        value: userData,
        update: x => setUserData(x)
      }}>
      {props.children}
    </UserContext.Provider>
  );
};