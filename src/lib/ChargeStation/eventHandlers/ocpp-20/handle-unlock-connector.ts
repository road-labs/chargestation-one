import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { UnlockConnectorResponse } from 'schemas/ocpp/2.0/UnlockConnectorResponse';
import { UnlockConnectorRequest } from 'schemas/ocpp/2.0/UnlockConnectorRequest';

const handleUnlockConnector: ChargeStationEventHandler<
  UnlockConnectorRequest
> = async ({ chargepoint, callMessageBody, callMessageId }) => {
  // connectorId 0 is not a valid connectorId
  // Currently, the simulator doesn't have a concept of evse's yet, so we ignore the supplied evseId
  if (!callMessageBody.connectorId) {
    const result: UnlockConnectorResponse = {
      status: 'UnknownConnector',
    };
    chargepoint.writeCallResult(callMessageId, result);
  }

  const response: UnlockConnectorResponse = {
    status: 'Unlocked',
  };
  if (chargepoint.hasRunningSession(callMessageBody.connectorId)) {
    await chargepoint.stopSession(callMessageBody.connectorId);
  } else {
    response.status = 'UnlockFailed';
  }

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleUnlockConnector;
