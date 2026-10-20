import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

const handleTransactionStartedUI: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  chargepoint.onSessionStart && chargepoint.onSessionStart(session.connectorId);
};

export default handleTransactionStartedUI;
