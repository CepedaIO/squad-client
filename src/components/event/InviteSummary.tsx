import React from "react";
import {Demote} from "squad-shared";
import {DateTime} from "luxon";
import {toHuman} from "../../services/utils";
import {useNavigate} from "react-router-dom";
import {IEvent, IInviteToken} from "../../services/api/event";

interface InviteSummaryProps {
  event: Pick<IEvent, 'id' | 'name'>
  invite: Pick<Demote<IInviteToken>, 'id' | 'uuid' | 'key' | 'expiresOn'>;
  'data-cy': string;
}

const InviteSummary = (props: InviteSummaryProps) => {
  const navigate = useNavigate();
  const {invite, event} = props;
  const durationUntilExpires = DateTime.fromISO(invite.expiresOn).diffNow().shiftTo('days')
  const onClickInvite = () => navigate(`/event/${event.id}/invite/${invite.uuid}/${invite.key}`);
  
  return (
    <main
      className={'center justify-between max-w-xs p-1 cursor-pointer'}
      data-cy={props['data-cy']}
      onClick={onClickInvite}
      key={invite.uuid}
    >
      <div>
        {event.name}
      </div>
      
      <div>
        {toHuman(durationUntilExpires, 'hours')}
      </div>
    </main>
  )
}

export default InviteSummary;
