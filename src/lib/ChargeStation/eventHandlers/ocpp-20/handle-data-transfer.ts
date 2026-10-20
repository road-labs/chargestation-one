import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { DataTransferRequest } from 'schemas/ocpp/2.0/DataTransferRequest';
import { DataTransferResponse } from 'schemas/ocpp/2.0/DataTransferResponse';

const handleDataTransfer: ChargeStationEventHandler<
  DataTransferRequest
> = async ({ chargepoint, callMessageId }) => {
  const response: DataTransferResponse = {
    status: 'UnknownVendorId',
  };

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleDataTransfer;
