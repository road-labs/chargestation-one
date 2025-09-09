import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { UnlockConnectorResponse } from 'schemas/ocpp/1.6/UnlockConnectorResponse';
import { UnlockConnectorRequest } from 'schemas/ocpp/1.6/UnlockConnector';

const handleUnlockConnector: ChargeStationEventHandler<
  UnlockConnectorRequest
> = async ({ chargepoint, callMessageBody, callMessageId }) => {
  // connectorId 0 is not a valid connectorId
  if (!callMessageBody.connectorId) {
    const result: UnlockConnectorResponse = {
      status: 'UnlockFailed',
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
