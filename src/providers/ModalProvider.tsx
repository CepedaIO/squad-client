import {createContext, useState} from "react";
import $c from "classnames";

interface ModalProviderProps {
  children: JSX.Element[] | JSX.Element;
}

interface IModalContext<Result> {
  result: Result | null;
  showing: JSX.Element | null;
  show: (modal?: JSX.Element | null) => void;
  resolve: (result:Result) => void;
}

export const ModalContext = createContext<IModalContext<any>>({
  result: null,
  showing: null,
  show: () => {},
  resolve: () => {}
});

const ModalProvider = <Result,>({
  children
}: ModalProviderProps) => {
  const [showing, setShowing] = useState<JSX.Element | null>(null);
  const [result, setResult] = useState<Result | null>(null)

  const show = (modal?: JSX.Element | null) => setShowing(modal || null);
  const resolve = (result:Result | null) => setResult(resolve);

  return (
    <ModalContext.Provider value={{
      result,
      showing,
      show,
      resolve
    }}>
      {
        showing &&
        <main className={$c('fixed inset-0 bg-opacity-70 bg-slate-50 lg:p-10')}>
          <section className={$c('bg-pink-100 border-2 w-full h-full rounded')}>
            { showing }
          </section>
        </main>
      }

      { children }
    </ModalContext.Provider>
  )
}

export default ModalProvider;
