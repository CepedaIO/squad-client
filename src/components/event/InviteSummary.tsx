import React from "react";
import {IInviteSummary, Demote} from "event-matcher-shared";
import {DateTime} from "luxon";
import {toHuman} from "../../services/utils";
import {useNavigate} from "react-router-dom";

interface InviteSummaryProps {
  invite: Demote<IInviteSummary>;
  'data-cy': string;
}

const InviteSummary = (props: InviteSummaryProps) => {
  const navigate = useNavigate();
  const {invite} = props;
  const durationUntilExpires = DateTime.fromISO(invite.expiresOn).diffNow().shiftTo('days')
  const onClickSummary = () => navigate(`/event/${invite.event.id}/invite/${invite.uuid}/${invite.key}`);
  
  return (
    <main
      className={'center justify-between max-w-xs p-1 cursor-pointer'}
      data-cy={props['data-cy']}
      onClick={onClickSummary}
    >
      <div>
        {invite.event.name}
      </div>
      
      <div>
        {toHuman(durationUntilExpires, 'hours')}
      </div>
    </main>
  )
}

export default InviteSummary;
