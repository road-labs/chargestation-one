import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { ClearChargingProfileRequest } from 'schemas/ocpp/2.0/ClearChargingProfileRequest';
import { ClearChargingProfileResponse } from 'schemas/ocpp/2.0/ClearChargingProfileResponse';

const handleClearChargingProfile: ChargeStationEventHandler<
  ClearChargingProfileRequest
> = ({ chargepoint, callMessageId }) => {
  const response: ClearChargingProfileResponse = { status: 'Accepted' };

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleClearChargingProfile;
