import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

const handleTransactionStoppedUI: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  chargepoint.onSessionStop && chargepoint.onSessionStop(session.connectorId);
};

export default handleTransactionStoppedUI;
