import DefaultOCPP16 from 'lib/ChargeStation/configurations/default-ocpp-16';
import {
  EventTypes as e,
  EventTypes16 as e16,
} from 'lib/ChargeStation/eventHandlers/event-types';
import overrideSessionUid from 'lib/ChargeStation/eventHandlers/ocpp-16/ies/override-session-uid';
import sendPaymentPostStart from 'lib/ChargeStation/eventHandlers/ocpp-16/ies/send-payment-post-start';
import sendReceipt from 'lib/ChargeStation/eventHandlers/ocpp-16/ies/send-receipt';
import sendPaymentPreStop from 'lib/ChargeStation/eventHandlers/ocpp-16/ies/send-payment-pre-stop';

export default {
  ...DefaultOCPP16,
  [e.SessionStartInitiated]: [
    overrideSessionUid,
    ...DefaultOCPP16.sessionInitiated,
  ],
  [e16.StartTransactionAccepted]: [
    ...DefaultOCPP16.startTransactionAccepted,
    sendPaymentPostStart,
  ],
  [e.SessionStopInitiated]: [
    sendPaymentPreStop,
    ...DefaultOCPP16.sessionStopInitiated,
  ],
  [e16.StopTransactionAccepted]: [
    ...DefaultOCPP16.stopTransactionAccepted,
    sendReceipt,
  ],
};
