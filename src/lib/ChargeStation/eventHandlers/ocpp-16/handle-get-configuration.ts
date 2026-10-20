import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { Variable } from 'lib/settings';
import { GetConfigurationRequest } from 'schemas/ocpp/1.6/GetConfiguration';
import { GetConfigurationResponse } from 'schemas/ocpp/1.6/GetConfigurationResponse';

type ConfigurationKey = NonNullable<
  GetConfigurationResponse['configurationKey']
>[number];

// an OCPP 1.6 charging station only holds key-value variables
type KeyValueVariable = Extract<Variable, { key: string }>;

const handleGetConfiguration: ChargeStationEventHandler<
  GetConfigurationRequest
> = async ({ chargepoint, callMessageId, callMessageBody }) => {
  const requestedKeys = callMessageBody?.key || [];
  const configurationKey: ConfigurationKey[] = [];
  const unknownKey: string[] = [];

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
      ...(
        chargepoint.configuration.getVariablesArray() as KeyValueVariable[]
      ).map((variable) => ({
        key: variable.key,
        value: `${variable.value}`,
        readonly: false,
      }))
    );
  }

  const response: GetConfigurationResponse = { configurationKey, unknownKey };

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleGetConfiguration;
