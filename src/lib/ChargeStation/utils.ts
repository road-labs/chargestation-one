// TODO: Improve this interface. Preferably based on the OCPP 2.0.1 specification types
interface SummarizeCommandParams {
  method: string;
  params: {
    meterStart?: number;
    meterStop?: number;
    idTag?: string;
    idToken?: { idToken?: string };
    status?: string;
    connectorStatus?: string;
    meterValue?: {
      sampledValue: {
        value: number;
        measurand?: string;
        unit?: string;
        unitOfMeasure?: { unit?: string };
      }[];
    }[];
  };
}

const measurandLabels: Record<string, string> = {
  'Energy.Active.Import.Register': 'energy',
  'Power.Active.Import': 'power',
  SoC: 'soc',
};

function summarizeMeterValues(
  meterValue: SummarizeCommandParams['params']['meterValue']
) {
  const result: Record<string, string> = {};
  for (const mv of meterValue ?? []) {
    const sampled = mv.sampledValue[0];
    if (!sampled) continue;
    const label = measurandLabels[sampled.measurand ?? ''];
    if (label) {
      const rawUnit = sampled.unit ?? sampled.unitOfMeasure?.unit ?? '';
      const unit = rawUnit === 'Percent' ? '%' : rawUnit;
      const value =
        label === 'soc' ? Number(sampled.value).toFixed(1) : sampled.value;
      result[label] = `${value}${unit}`;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

export function summarizeCommandParams({
  method,
  params: {
    idTag,
    idToken,
    meterStart,
    meterStop,
    meterValue,
    status,
    connectorStatus,
  },
}: SummarizeCommandParams) {
  const uid = idTag ?? idToken?.idToken;
  switch (method) {
    case 'StartTransaction':
      return { meterStart, uid };
    case 'StopTransaction':
      return { meterStop, uid };
    case 'Authorize':
      return { uid };
    case 'StatusNotification':
      return { status: status ?? connectorStatus };
    case 'MeterValues':
    case 'TransactionEvent':
      return summarizeMeterValues(meterValue);
  }

  return null;
}

export function toCamelCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
