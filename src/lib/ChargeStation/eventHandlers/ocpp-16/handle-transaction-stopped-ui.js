export default async function handleTransactionStoppedUI({
  chargepoint,
  session,
}) {
  chargepoint.onSessionStop &&
    chargepoint.onSessionStop(session.connectorNumber);
}
