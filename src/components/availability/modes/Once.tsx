import FormInput from "../../inline-block/FormInput";

interface OnceProps {
  label: string;
  field: string;
}

const Once = ({ label, field }:OnceProps) => {

  return (
    <main>
      <FormInput label={label} field={field} type={"date"} />
    </main>
  )
};

export default Once;

