import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { DataTransferResponse } from 'schemas/ocpp/1.6/DataTransferResponse';
import { EventTypes } from '../../event-types';

const handleDataTransferCallResultReceived: ChargeStationEventHandler<
  unknown,
  DataTransferResponse
> = async ({ emitter, session, callResultMessageBody }) => {
  if (!callResultMessageBody.data) {
    return;
  }

  const data = JSON.parse(callResultMessageBody.data);

  // In case of an authorization. Can be improved a bit if we actually pass the actual messageId (Authorize/Receipt)
  if (data.tagId) {
    // Update the uid with the one we got from the CSMS.
    session.options.uid = data.tagId;
    emitter.emitEvent(EventTypes.AuthorizationAccepted, { session });
  }
};

export default handleDataTransferCallResultReceived;
