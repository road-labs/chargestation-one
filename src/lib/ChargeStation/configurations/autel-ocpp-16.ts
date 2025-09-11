import DefaultOCPP16 from 'lib/ChargeStation/configurations/default-ocpp-16';
import {
  EventTypes as e,
  EventTypes16 as e16,
} from 'lib/ChargeStation/eventHandlers/event-types';
import overrideSessionUid from 'lib/ChargeStation/eventHandlers/ocpp-16/autel/override-session-uid';
import { calculateCostsAndSendDetails } from 'lib/ChargeStation/eventHandlers/ocpp-16/autel/handle-session-stopped';
import sendStatusNotificationFinishing from 'lib/ChargeStation/eventHandlers/ocpp-16/send-status-notification-finishing';
import sendStatusNotificationAvailable from 'lib/ChargeStation/eventHandlers/ocpp-16/send-status-notification-available';
import handleTransactionStoppedUI from 'lib/ChargeStation/eventHandlers/ocpp-16/handle-transaction-stopped-ui';
import sendAuthorizeOrStartTransaction from 'lib/ChargeStation/eventHandlers/ocpp-16/send-authorize-or-start-transaction';

export default {
  ...DefaultOCPP16,
  [e.SessionStartInitiated]: [
    overrideSessionUid,
    sendAuthorizeOrStartTransaction,
  ],
  [e16.StopTransactionAccepted]: [
    sendStatusNotificationFinishing,
    sendStatusNotificationAvailable,
    calculateCostsAndSendDetails,
    handleTransactionStoppedUI,
  ],
};
