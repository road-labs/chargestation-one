export default async function handleRemoteStopTransaction({
  chargepoint,
  callMessageId,
  callMessageBody,
}) {
  const { transactionId } = callMessageBody;

  const connectorNumber = chargepoint.connectors
    .map((c) => c.connectorNumber)
    .find(
      (n) =>
        chargepoint.sessions[n] &&
        chargepoint.sessions[n].transactionId?.toString() ===
          transactionId?.toString()
    );

  let response;
  if (!connectorNumber || !chargepoint.hasRunningSession(connectorNumber)) {
    response = {
      status: 'Rejected',
    };
  } else {
    setTimeout(() => {
      chargepoint.stopSession(connectorNumber);
    }, 100);
    response = {
      status: 'Accepted',
    };
  }

  chargepoint.writeCallResult(callMessageId, response);
}
