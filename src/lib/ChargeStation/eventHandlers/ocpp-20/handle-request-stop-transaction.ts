import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { RequestStopTransactionRequest } from 'schemas/ocpp/2.0/RequestStopTransactionRequest';
import { RequestStopTransactionResponse } from 'schemas/ocpp/2.0/RequestStopTransactionResponse';

const handleRequestStopTransaction: ChargeStationEventHandler<
  RequestStopTransactionRequest
> = ({ chargepoint, callMessageId, callMessageBody }) => {
  const { transactionId } = callMessageBody;

  let response: RequestStopTransactionResponse;

  const connectorNumber = chargepoint.connectors
    .map((c) => c.connectorNumber)
    .find(
      (n) =>
        chargepoint.sessions[n] &&
        chargepoint.sessions[n].transactionId?.toString() ===
          transactionId?.toString()
    );
  if (!connectorNumber || !chargepoint.hasRunningSession(connectorNumber)) {
    response = {
      status: 'Rejected',
    };
  } else {
    setTimeout(() => {
      chargepoint.stopSession(connectorNumber);
    }, 100);
    response = {
      status: 'Accepted',
    };
  }

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleRequestStopTransaction;
