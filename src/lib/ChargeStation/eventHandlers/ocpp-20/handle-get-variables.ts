import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

import { GetVariablesRequest } from 'schemas/ocpp/2.0/GetVariablesRequest';
import {
  GetVariableResultType,
  GetVariablesResponse,
} from 'schemas/ocpp/2.0/GetVariablesResponse';
import { Variable2, getVariableKey } from 'lib/settings';

const handleGetVariables: ChargeStationEventHandler<
  GetVariablesRequest,
  GetVariablesResponse
> = ({ chargepoint, callMessageId, callMessageBody }) => {
  const { getVariableData } = callMessageBody;

  chargepoint.writeCallResult(callMessageId, {
    getVariableResult: getVariableData.map((vData): GetVariableResultType => {
      const value = chargepoint.configuration.getVariableValue(
        getVariableKey(vData as Variable2)
      );

      return {
        attributeStatus: 'Accepted',
        component: vData.component,
        variable: vData.variable,
        attributeValue: value?.toString(),
      };
    }),
  });
};

export default handleGetVariables;
