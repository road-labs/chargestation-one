import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { SetChargingProfileRequest } from 'schemas/ocpp/2.0/SetChargingProfileRequest';
import { SetChargingProfileResponse } from 'schemas/ocpp/2.0/SetChargingProfileResponse';

// The simulator doesn't model charging profiles yet: this only acknowledges the call and doesn't limit charging
const handleSetChargingProfile: ChargeStationEventHandler<
  SetChargingProfileRequest
> = ({ chargepoint, callMessageId }) => {
  const response: SetChargingProfileResponse = { status: 'Accepted' };

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleSetChargingProfile;
