import {useState} from "react";
import $c from "classnames";

export interface IModalContext<Result> {
  result: Result | null;
  showing: JSX.Element | null;
  show: (modal?: JSX.Element | null) => void;
  resolve: (result:Result) => void;
}

const modalProvider = <Result,>() => {
  const [showing, setShowing] = useState<JSX.Element | null>(null);
  const [result, setResult] = useState<Result | null>(null)

  const show = (modal?: JSX.Element | null) => setShowing(modal || null);
  const resolve = (result:Result | null) => setResult(resolve);

  return {
    context: {
      result,
      showing,
      show,
      resolve
    },
    view: showing && (
      <main className={$c('fixed inset-0 bg-opacity-70 bg-slate-50 lg:p-10')}>
        <section className={$c('bg-pink-100 border-2 w-full h-full rounded')}>
          { showing }
        </section>
      </main>
    )
  };
}

export default modalProvider;
