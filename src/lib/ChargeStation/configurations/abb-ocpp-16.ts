import DefaultOCPP16 from 'lib/ChargeStation/configurations/default-ocpp-16';
import { EventTypes as e } from 'lib/ChargeStation/eventHandlers/event-types';
import overrideSessionUid from 'lib/ChargeStation/eventHandlers/ocpp-16/abb/override-session-uid';
import sendAuthorizeOrStartTransaction from 'lib/ChargeStation/eventHandlers/ocpp-16/send-authorize-or-start-transaction';

export default {
  ...DefaultOCPP16,
  [e.SessionStartInitiated]: [
    overrideSessionUid,
    sendAuthorizeOrStartTransaction,
  ],
};
