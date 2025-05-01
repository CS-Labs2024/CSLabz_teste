import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Calendar,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Repeat,
  Search,
  Download,
  Upload,
  FileText,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { scaleLinear } from 'd3-scale';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { useClientData } from '../contexts/ClientDataContext';
import { useNavigate } from 'react-router-dom';

interface RFVCustomer {
  id: string;
  name: string;
  recency: number; // dias desde a última compra
  frequency: number; // número de compras
  value: number; // valor médio por compra
  totalValue: number; // valor total gasto
  segment?: string;
  channel?: string;
  region?: string;
  lastPurchase: string;
}

interface RFVScore {
  r: number;
  f: number;
  v: number;
  segment: string;
}

const calculateRFVScore = (customer: RFVCustomer): RFVScore => {
  // R score (1-5, 5 sendo o mais recente)
  const rScore = 5 - Math.min(5, Math.floor(customer.recency / 30));

  // F score (1-5, 5 sendo a maior frequência)
  const fScore = Math.min(5, Math.ceil(customer.frequency / 5));

  // V score (1-5, 5 sendo o maior valor)
  const vScore = Math.min(5, Math.ceil(customer.value / 200));

  let segment = 'Em Risco';
  const total = rScore + fScore + vScore;

  if (total >= 12) segment = 'Champions';
  else if (total >= 9) segment = 'Leais';
  else if (total >= 6) segment = 'Potenciais';
  else segment = 'Em Risco';

  return { r: rScore, f: fScore, v: vScore, segment };
};

const colorScale = scaleLinear<string>()
  .domain([0, 1000])
  .range(['#ff6b6b', '#51cf66'])
  .clamp(true);

export default function RFVAnalysis() {
  const { clients } = useClientData();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('12');
  const [regionFilter, setRegionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [showGuide, setShowGuide] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Dados de exemplo para RFV - em um cenário real, estes viriam de uma API ou importação
  const sampleRFVData: RFVCustomer[] = useMemo(() => {
    // Verificar se temos dados RFV
    const hasRFVData = clients.some(client => 
      client.DataUltimaCompra || 
      client.QuantidadeCompras || 
      client.ValorTotalCompras
    );
    
    if (!hasRFVData) return [];
    
    return clients.map((client, index) => {
      // Usar DataUltimaCompra se disponível, senão usar UltimoContato como proxy
      const lastPurchaseDate = client.DataUltimaCompra 
        ? new Date(client.DataUltimaCompra) 
        : client.UltimoContato 
          ? new Date(client.UltimoContato) 
          : new Date();
      
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastPurchaseDate.getTime());
      const recency = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Usar QuantidadeCompras se disponível, senão estimar
      const frequency = client.QuantidadeCompras 
        ? parseFloat(client.QuantidadeCompras) 
        : client.atividades?.length || Math.floor(Math.random() * 10) + 1;
      
      // Usar ValorTotalCompras ou MRR como proxy
      const totalValue = client.ValorTotalCompras 
        ? parseFloat(client.ValorTotalCompras) 
        : parseFloat(client.MRR || '0') * 12;
      
      // Calcular valor médio por compra
      const value = frequency > 0 ? totalValue / frequency : totalValue;
      
      return {
        id: `C${index + 1}`,
        name: client.Nome || `Cliente ${index + 1}`,
        recency,
        frequency,
        value,
        totalValue,
        segment: client.Tier || 'Não categorizado',
        channel: client.CategoriaContato || 'Direto',
        region: 'Não especificada',
        lastPurchase: client.DataUltimaCompra || client.UltimoContato || today.toISOString(),
      };
    });
  }, [clients]);

  const hasRFVData = sampleRFVData.length > 0;

  const filteredData = useMemo(() => {
    return sampleRFVData.filter((customer) => {
      if (regionFilter !== 'all' && customer.region !== regionFilter) return false;
      if (selectedSegment !== 'all' && customer.segment !== selectedSegment)
        return false;
      if (selectedChannel !== 'all' && customer.channel !== selectedChannel)
        return false;
      if (
        searchTerm &&
        !customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [sampleRFVData, timeFilter, regionFilter, searchTerm, selectedSegment, selectedChannel]);

  const metrics = useMemo(() => {
    if (filteredData.length === 0) return {
      avgRecency: 0,
      avgFrequency: 0,
      avgValue: 0,
      totalRevenue: 0,
    };

    const avgRecency =
      filteredData.reduce((sum, c) => sum + c.recency, 0) / filteredData.length;
    const avgFrequency =
      filteredData.reduce((sum, c) => sum + c.frequency, 0) / filteredData.length;
    const avgValue =
      filteredData.reduce((sum, c) => sum + c.value, 0) / filteredData.length;
    const totalRevenue = filteredData.reduce((sum, c) => sum + c.totalValue, 0);

    return {
      avgRecency: Math.round(avgRecency),
      avgFrequency: Math.round(avgFrequency * 10) / 10,
      avgValue: Math.round(avgValue),
      totalRevenue,
    };
  }, [filteredData]);

  const scatterData = useMemo(() => {
    return filteredData.map((customer) => ({
      x: customer.recency,
      y: customer.frequency,
      z: customer.value,
      name: customer.name,
    }));
  }, [filteredData]);

  const handleGoToClientTable = () => {
    navigate('/dashboard/clients');
  };

  const handleFileUpload = (file: File) => {
    // Aqui implementaríamos a lógica para processar o arquivo CSV com dados RFV
    console.log("Arquivo selecionado:", file.name);
    setShowUploadModal(false);
  };

  if (!hasRFVData) {
    return (
      <div className="min-h-screen bg-[#FDFFEE] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center mb-8">
            <BarChart2 className="w-12 h-12 text-[#00FFC6] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#002b28] mb-2">
              Análise RFV
            </h1>
            <p className="text-gray-600 mb-8">
              Para realizar análises RFV (Recência, Frequência, Valor), você precisa importar dados que incluam informações sobre compras dos clientes, como data da última compra, quantidade de compras e valor total.
            </p>
            <Button
              onClick={handleGoToClientTable}
              className="bg-[#00FFC6] text-[#002b28] hover:bg-[#00FFC6]/90 inline-flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Ir para Importação de Dados
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFFEE]">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="h-7 w-7 text-[#00FFC6]" />
              <h1 className="text-2xl font-bold text-[#002b28]">
                Análise RFV
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[180px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as regiões</SelectItem>
                  <SelectItem value="North">Norte</SelectItem>
                  <SelectItem value="South">Sul</SelectItem>
                  <SelectItem value="East">Leste</SelectItem>
                  <SelectItem value="West">Oeste</SelectItem>
                </SelectContent>
              </Select>

              <button 
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Importar Dados RFV
              </button>

              <button className="px-4 py-2 bg-[#00FFC6] text-[#002b28] rounded-lg hover:bg-[#00FFC6]/90 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Recência Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.avgRecency} dias
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Repeat className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Frequência Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.avgFrequency}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {metrics.avgValue}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <BarChart2 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">
              Dispersão Recência vs Frequência
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Recência"
                    unit=" dias"
                    domain={[0, 365]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Frequência"
                    unit=" compras"
                  />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[50, 400]}
                    name="Valor"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p>Recência: {data.x} dias</p>
                            <p>Frequência: {data.y} compras</p>
                            <p>Valor Médio: R$ {data.z}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Clientes" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorScale(entry.z)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Matriz RFV</h2>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }, (_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const count = filteredData.filter((customer) => {
                  const score = calculateRFVScore(customer);
                  return score.r === 5 - row && score.f === col + 1;
                }).length;
                const opacity = Math.min(count / 10, 1);
                
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: `rgba(0, 255, 198, ${opacity})`,
                      color: opacity > 0.5 ? '#002b28' : '#002b28',
                    }}
                  >
                    {count}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Eixo Y: Recência</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mais recente</span>
                  <span>Menos recente</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Eixo X: Frequência</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Menor</span>
                  <span>Maior</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold">Clientes</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os segmentos</SelectItem>
                    {Array.from(new Set(sampleRFVData.map(c => c.segment))).map(segment => (
                      <SelectItem key={segment} value={segment || ''}>
                        {segment || 'Não categorizado'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os canais</SelectItem>
                    {Array.from(new Set(sampleRFVData.map(c => c.channel))).map(channel => (
                      <SelectItem key={channel} value={channel || ''}>
                        {channel || 'Não especificado'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Recência (dias)</TableHead>
                  <TableHead>Frequência (compras)</TableHead>
                  <TableHead>Ticket Médio (R$)</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Valor Total (R$)</TableHead>
                  <TableHead>Última Compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((customer) => {
                  const rfvScore = calculateRFVScore(customer);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.recency}</TableCell>
                      <TableCell>{customer.frequency}</TableCell>
                      <TableCell>{customer.value.toFixed(0)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rfvScore.segment === 'Champions'
                              ? 'bg-green-100 text-green-800'
                              : rfvScore.segment === 'Leais'
                              ? 'bg-blue-100 text-blue-800'
                              : rfvScore.segment === 'Potenciais'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rfvScore.segment}
                        </span>
                      </TableCell>
                      <TableCell>{customer.segment}</TableCell>
                      <TableCell>{customer.channel}</TableCell>
                      <TableCell>{customer.totalValue.toFixed(0)}</TableCell>
                      <TableCell>
                        {new Date(customer.lastPurchase || '').toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Help Button - Fixed position at bottom right */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Ajuda"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Instruções de Uso - Matriz RFV</h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-gray-900 overflow-y-auto max-h-[70vh] scrollbar-none">
                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">O que é RFV?</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li><strong>R (Recência)</strong>: Tempo desde a última compra do cliente</li>
                    <li><strong>F (Frequência)</strong>: Número de compras realizadas pelo cliente</li>
                    <li><strong>V (Valor)</strong>: Valor médio gasto pelo cliente em cada compra</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Interpretando a Matriz</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li>Cada célula representa uma combinação de recência e frequência</li>
                    <li>O número em cada célula indica quantos clientes estão nessa categoria</li>
                    <li>A intensidade da cor representa a concentração de clientes</li>
                    <li>O eixo Y (vertical) representa a recência - quanto mais alto, mais recente</li>
                    <li>O eixo X (horizontal) representa a frequência - quanto mais à direita, maior a frequência</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Classificação de Clientes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li><strong>Champions</strong>: Clientes de alto valor, compras recentes e frequentes</li>
                    <li><strong>Leais</strong>: Clientes fiéis com bom histórico de compras</li>
                    <li><strong>Potenciais</strong>: Clientes com potencial de crescimento</li>
                    <li><strong>Em Risco</strong>: Clientes com risco de abandono, baixa recência ou frequência</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Formato do CSV para Importação</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-900">
                    <li>Nome (Nome do cliente)</li>
                    <li>Tier (Classificação do cliente)</li>
                    <li>MRR (Receita mensal recorrente)</li>
                    <li>Produto (Produto contratado)</li>
                    <li>UltimoContato (Data do último contato)</li>
                    <li>CategoriaContato (Tipo do último contato)</li>
                    <li>ProximoContato (Data do próximo contato agendado)</li>
                    <li>DataUltimaCompra (Data da última compra)</li>
                    <li>QuantidadeCompras (Número total de compras)</li>
                    <li>ValorTotalCompras (Valor total gasto pelo cliente)</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Importar Dados RFV</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Faça upload de um arquivo CSV contendo os dados RFV dos seus clientes.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#00FFC6] transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    id="rfv-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <label htmlFor="rfv-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">
                      Clique para fazer upload do arquivo CSV
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Formato esperado do CSV:
                </h3>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Nome (Nome do cliente)</li>
                  <li>Tier (Classificação do cliente)</li>
                  <li>MRR (Receita mensal recorrente)</li>
                  <li>Produto (Produto contratado)</li>
                  <li>UltimoContato (Data do último contato)</li>
                  <li>CategoriaContato (Tipo do último contato)</li>
                  <li>ProximoContato (Data do próximo contato agendado)</li>
                  <li>DataUltimaCompra (Data da última compra)</li>
                  <li>QuantidadeCompras (Número total de compras)</li>
                  <li>ValorTotalCompras (Valor total gasto pelo cliente)</li>
                </ul>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Exemplo de conteúdo:</p>
                <pre className="bg-gray-50 p-3 rounded-lg mt-2 overflow-x-auto">
                  Nome,Tier,MRR,Produto,UltimoContato,CategoriaContato,ProximoContato,DataUltimaCompra,QuantidadeCompras,ValorTotalCompras<br/>
                  Empresa ABC,Enterprise,850,Software,2023-12-15,Reunião,2024-01-15,2023-12-15,24,20400<br/>
                  Startup XYZ,Startup,320,Serviço,2023-11-01,Email,2024-02-01,2023-11-01,5,1600
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}