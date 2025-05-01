import { RiskEntry, KPIData } from '../types';

const calculateDaysInRisk = (entrada: string, saida: string | null): number => {
  const startDate = new Date(entrada);
  const endDate = saida ? new Date(saida) : new Date();
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateLastTouchpoint = (notas: RiskEntry['notas']): string => {
  if (!notas || notas.length === 0) return '';
  return notas.reduce((latest, note) => {
    return note.data > latest ? note.data : latest;
  }, notas[0].data);
};

const calculateDaysSinceLastTouchpoint = (lastTouchpoint: string): number => {
  if (!lastTouchpoint) return 0;
  const touchpointDate = new Date(lastTouchpoint);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - touchpointDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const sortMonths = (months: string[]): string[] => {
  const monthOrder = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return months.sort((a, b) => {
    const indexA = monthOrder.indexOf(a);
    const indexB = monthOrder.indexOf(b);
    return indexA - indexB;
  });
};

export const calculateKPIs = (data: RiskEntry[]): KPIData => {
  const resolvedRisks = data.filter((entry) => entry.dataSaida).length;
  const totalClients = data.length;
  const activeRisks = data.filter(
    (entry) => !entry.dataSaida && !entry.dataCancelamento
  ).length;
  const canceledContracts = data.filter(
    (entry) =>
      entry.dataCancelamento ||
      entry.statusAtual.toLowerCase().includes('cancelado')
  ).length;

  // Calculate touchpoint metrics
  const clientsWithTouchpoints = data.filter(
    (entry) => entry.notas && entry.notas.length > 0
  );
  const clientsWithoutTouchpoint = totalClients - clientsWithTouchpoints.length;

  // Calculate average time between touchpoints
  const touchpointIntervals = clientsWithTouchpoints.map((client) => {
    const sortedNotes = [...client.notas].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    const intervals = [];
    for (let i = 0; i < sortedNotes.length - 1; i++) {
      const days =
        Math.abs(
          new Date(sortedNotes[i].data).getTime() -
            new Date(sortedNotes[i + 1].data).getTime()
        ) /
        (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    return intervals.length > 0
      ? intervals.reduce((a, b) => a + b) / intervals.length
      : 0;
  });

  const averageTouchpointInterval =
    touchpointIntervals.length > 0
      ? touchpointIntervals.reduce((a, b) => a + b) / touchpointIntervals.length
      : 0;

  // Calculate resolution time for resolved cases
  const resolutionTimes = data
    .filter((entry) => entry.dataSaida)
    .map((entry) => calculateDaysInRisk(entry.dataEntrada, entry.dataSaida));

  const averageTimeToResolution =
    resolutionTimes.length > 0
      ? resolutionTimes.reduce((a, b) => a + b) / resolutionTimes.length
      : 0;

  const risksBySquad = data.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.squad] = (acc[curr.squad] || 0) + 1;
    return acc;
  }, {});

  const risksByTier = data.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.tier] = (acc[curr.tier] || 0) + 1;
    return acc;
  }, {});

  const totalDaysInRisk = data.reduce(
    (sum, entry) =>
      sum + calculateDaysInRisk(entry.dataEntrada, entry.dataSaida),
    0
  );

  const statusDistribution = data.reduce(
    (acc: { [key: string]: number }, curr) => {
      acc[curr.statusAtual] = (acc[curr.statusAtual] || 0) + 1;
      return acc;
    },
    {}
  );

  const risksByMonth = data.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.mesEntrada] = (acc[curr.mesEntrada] || 0) + 1;
    return acc;
  }, {});

  const sortedMonths = sortMonths(Object.keys(risksByMonth));
  const orderedRisksByMonth: { [key: string]: number } = {};
  sortedMonths.forEach((month) => {
    orderedRisksByMonth[month] = risksByMonth[month];
  });

  return {
    reversalRate: (resolvedRisks / totalClients) * 100,
    averageDaysInRisk: totalDaysInRisk / totalClients,
    totalClients,
    activeRisks,
    resolvedRisks,
    canceledContracts,
    cancellationRate: (canceledContracts / totalClients) * 100,
    risksBySquad,
    risksByTier,
    statusDistribution,
    risksByMonth: orderedRisksByMonth,
    averageTimeToResolution,
    clientsWithoutTouchpoint,
    averageTouchpointInterval,
  };
};

export const updateEntryDaysInRisk = (entry: RiskEntry): RiskEntry => {
  return {
    ...entry,
    diasEmRisco: calculateDaysInRisk(entry.dataEntrada, entry.dataSaida),
    ultimoTouchpoint: calculateLastTouchpoint(entry.notas),
  };
};
