import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { ClearChargingProfileRequest } from 'schemas/ocpp/1.6/ClearChargingProfile';
import { ClearChargingProfileResponse } from 'schemas/ocpp/1.6/ClearChargingProfileResponse';

// The simulator doesn't model charging profiles yet: this only acknowledges the call, so the CPMS gets an answer
const handleClearChargingProfile: ChargeStationEventHandler<
  ClearChargingProfileRequest
> = ({ chargepoint, callMessageId }) => {
  const response: ClearChargingProfileResponse = { status: 'Accepted' };

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleClearChargingProfile;
