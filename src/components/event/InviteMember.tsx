import line from "../../services/input-types/line";
import multiline from "../../services/input-types/multiline";
import $c from "classnames";
import Button from "../inline/Button";
import React from "react";
import FormContext, {createFormContext} from "../../providers/FormContext";
import {useFormControls} from "../../hooks/useFormControls";
import useForm from "../../hooks/useForm";
import {apiCreateInvite} from "../../services/api/event";
import {useParams} from "react-router-dom";

export interface IInviteMemberForm {
  email: string;
  message: string;
}

interface InviteMemberProps {
  onSubmit(form: IInviteMemberForm): void;
}
const InviteMemberContent = ({
  onSubmit
}: InviteMemberProps) => {
  const { id } = useParams();
  const { validate } = useForm<IInviteMemberForm>();
  const { FormInput } = useFormControls<IInviteMemberForm>();
  const [mut, { data, loading, error }] = apiCreateInvite();
  
  const clickedInvite = () => {
    const [isValid, payload] = validate();
    if(isValid) {
      mut({ variables: {
        payload: {
          ...payload,
          id: parseInt(id!)
        }
      }}).then(() => onSubmit(payload))
    }
  }

  return (
    <section>
      <FormInput
        label={"Email:"}
        field={"email"}
        type={line}
      />

      <FormInput
        label={"Message:"}
        field={"message"}
        type={multiline}
      />

      <footer className={$c('center grow-children')}>
        <Button
          variant={"link"}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant={"link"}
          data-cy={"invite:submit"}
          onClick={clickedInvite}
          disabled={loading}
        >
          Invite
        </Button>
      </footer>
    </section>
  )
}

const InviteMember = (props: InviteMemberProps) => {
  const context = createFormContext({
    email: '',
    message: ''
  });

  return (
    <FormContext.Provider value={ context }>
      <InviteMemberContent { ...props } />
    </FormContext.Provider>
  )
}

export default InviteMember;
