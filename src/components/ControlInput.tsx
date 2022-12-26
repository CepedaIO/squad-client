import Split from "./Split";
import {
  CustomInputDescriptor
} from "../services/input-types";

export interface InjectedInputProps<Value> {
  type: CustomInputDescriptor<Value>;
  label: string;
  nowrap?: boolean;
  value?: Value;
  onChange?: (value: Value | null) => void;
  error?: string;
}

export type ControlInputProps<Value> = InjectedInputProps<Value>;

const ControlInput = <Value,>(props: ControlInputProps<Value>) => (
  <main>
    <Split
      nowrap={props.nowrap}
      left={ <label>{ props.label }</label> }
      right={ props.type.input(props) }
    />

    <section className={"min-h-[20px] text-right text-error text-sm"}>
      { props.error }
    </section>
  </main>
);

export default ControlInput;
