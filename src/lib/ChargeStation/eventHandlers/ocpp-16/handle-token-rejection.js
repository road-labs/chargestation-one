import { sleep } from '../../../../utils/csv';
import { EventTypes } from '../event-types';

export default async function handleTokenRejection({
  chargepoint,
  emitter,
  session,
}) {
  if (!chargepoint.sessions[session.connectorNumber]) {
    return;
  }

  chargepoint.sessions[session.connectorNumber].isStartingSession = false;
  chargepoint.sessions[session.connectorNumber].isStoppingSession = true;

  await sleep(1000);

  delete chargepoint.sessions[session.connectorNumber];
  emitter.emitEvent(EventTypes.SessionCancelled, { session });
}
