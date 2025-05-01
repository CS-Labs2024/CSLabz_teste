import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { AlertTriangle, FileDown, Plus, History, Users } from 'lucide-react';
import { useState } from 'react';
import { Customer, Activity } from '../types';
import * as XLSX from 'xlsx';

interface CustomerTableProps {
  customers: Customer[];
  onUpdateCustomer?: (updatedCustomer: Customer) => void;
}

const ACTIVITY_TYPES = [
  'Reunião',
  'Ligação',
  'Email',
  'Visita',
  'Suporte',
  'Treinamento',
  'QBR',
  'Outro',
] as const;

export default function CustomerTable({
  customers,
  onUpdateCustomer,
}: CustomerTableProps) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    descricao: '',
    responsavel: '',
  });

  const filteredCustomers = customers.filter((customer) => {
    if (!customer) return false;
    const searchLower = search.toLowerCase();
    return (
      (customer.Nome?.toLowerCase() || '').includes(searchLower) ||
      (customer.Produto?.toLowerCase() || '').includes(searchLower) ||
      (customer.Tier?.toLowerCase() || '').includes(searchLower)
    );
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (value?: string | number) => {
    const num = typeof value === 'number' ? value : parseFloat(value || '0');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const calculateDaysSinceTouch = (activityDate: string) => {
    const today = new Date();
    const last = new Date(activityDate);
    const diff = Math.abs(today.getTime() - last.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-4 font-[Inter]">
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Buscar Cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-10 h-10 border-gray-300 focus:border-[#00FFC6] focus:ring-[#00FFC6]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-300 bg-white shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#002B28] hover:bg-[#002B28]">
              <TableHead className="font-bold text-white text-left">
                Nome do Cliente
              </TableHead>
              <TableHead className="font-bold text-white text-center">
                Tier
              </TableHead>
              <TableHead className="font-bold text-white text-center">
                MRR
              </TableHead>
              <TableHead className="font-bold text-white text-left">
                Produto
              </TableHead>
              <TableHead className="font-bold text-white text-left">
                Categoria
              </TableHead>
              <TableHead className="font-bold text-white text-center">
                Dias sem Touch
              </TableHead>
              <TableHead className="font-bold text-white text-right">
                Próximo Contato
              </TableHead>
              <TableHead className="font-bold text-white text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length ? (
              filteredCustomers.map((c, i) => (
                <TableRow
                  key={i}
                  className={`${
                    i % 2 === 0 ? 'bg-white' : 'bg-[#FDFFEE]'
                  } hover:bg-[#00FFC6]/20 transition-colors text-sm`}
                >
                  <TableCell className="text-left font-medium">
                    {c.Nome || '-'}
                  </TableCell>
                  <TableCell className="text-center">{c.Tier || '-'}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(c.MRR)}
                  </TableCell>
                  <TableCell className="text-left">
                    {c.Produto || '-'}
                  </TableCell>
                  <TableCell className="text-left">
                    {c.CategoriaContato || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {c.DiasSemTouch ?? '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(c.ProximoContato)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCustomer(c)}
                            className="h-8 w-8 p-0 hover:bg-[#00FFC6]/30"
                          >
                            <Plus className="h-4 w-4 text-[#002B28]" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>
                              Registrar Atividade - {c.Nome}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Data</Label>
                              <Input
                                type="date"
                                value={newActivity.data}
                                onChange={(e) =>
                                  setNewActivity((prev) => ({
                                    ...prev,
                                    data: e.target.value,
                                  }))
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Tipo</Label>
                              <Select
                                value={newActivity.tipo}
                                onValueChange={(value) =>
                                  setNewActivity((prev) => ({
                                    ...prev,
                                    tipo: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ACTIVITY_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Responsável</Label>
                              <Input
                                value={newActivity.responsavel}
                                onChange={(e) =>
                                  setNewActivity((prev) => ({
                                    ...prev,
                                    responsavel: e.target.value,
                                  }))
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Descrição</Label>
                              <Textarea
                                value={newActivity.descricao}
                                onChange={(e) =>
                                  setNewActivity((prev) => ({
                                    ...prev,
                                    descricao: e.target.value,
                                  }))
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => {
                                if (
                                  !selectedCustomer ||
                                  !newActivity.tipo ||
                                  !newActivity.descricao ||
                                  !newActivity.responsavel
                                )
                                  return;
                                const activity: Activity = {
                                  data:
                                    newActivity.data ||
                                    new Date().toISOString(),
                                  tipo: newActivity.tipo,
                                  descricao: newActivity.descricao,
                                  responsavel: newActivity.responsavel,
                                };
                                const updated: Customer = {
                                  ...selectedCustomer,
                                  atividades: [
                                    ...(selectedCustomer.atividades || []),
                                    activity,
                                  ],
                                  UltimoContato: activity.data,
                                  CategoriaContato: activity.tipo,
                                  DiasSemTouch: calculateDaysSinceTouch(
                                    activity.data
                                  ),
                                };
                                onUpdateCustomer?.(updated);
                                setSelectedCustomer(null);
                                setNewActivity({
                                  data: new Date().toISOString().split('T')[0],
                                  tipo: '',
                                  descricao: '',
                                  responsavel: '',
                                });
                              }}
                              className="w-full sm:w-auto bg-[#002B28] text-white hover:bg-[#001A18]"
                            >
                              Salvar Atividade
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCustomer(c)}
                            className="h-8 w-8 p-0 hover:bg-[#00FFC6]/30"
                          >
                            <History className="h-4 w-4 text-[#002B28]" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Histórico de Atividades - {c.Nome}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            {c.atividades && c.atividades.length ? (
                              <div className="space-y-4">
                                {c.atividades.map((act, idx) => (
                                  <div
                                    key={idx}
                                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                          {act.tipo}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          {formatDate(act.data)}
                                        </span>
                                      </div>
                                      <span className="text-sm font-medium text-muted-foreground">
                                        por {act.responsavel}
                                      </span>
                                    </div>
                                    <p className="text-sm">{act.descricao}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhuma atividade registrada</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Users className="h-8 w-8 mb-2 mx-auto opacity-50" />
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
