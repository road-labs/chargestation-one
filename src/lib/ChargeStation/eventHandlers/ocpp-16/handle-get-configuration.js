export default async function handleGetConfiguration({
  chargepoint,
  callMessageId,
  callMessageBody,
}) {
  const requestedKeys = callMessageBody?.key || [];
  const configurationKey = [];
  const unknownKey = [];

  if (requestedKeys.length > 0) {
    for (const key of requestedKeys) {
      const value = chargepoint.configuration.getVariableValue(key);
      if (value !== null) {
        configurationKey.push({ key, value: `${value}`, readonly: false });
      } else {
        unknownKey.push(key);
      }
    }
  } else {
    configurationKey.push(
      ...chargepoint.configuration.getVariablesArray().map((variable) => ({
        key: variable.key,
        value: `${variable.value}`,
        readonly: false,
      }))
    );
  }

  chargepoint.writeCallResult(callMessageId, { configurationKey, unknownKey });
}
