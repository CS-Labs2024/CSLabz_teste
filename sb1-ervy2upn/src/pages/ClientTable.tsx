import React, { useState } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Trash2,
  Download,
  Users,
} from 'lucide-react';
import { useClientData } from '../contexts/ClientDataContext';
import CustomerTable from '../components/CustomerTable';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import * as XLSX from 'xlsx';

export default function ClientTable() {
  const { clients, setClients, uploadCSV, clearData } = useClientData();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadCSV(file);
      setUploadResult(result);
      if (result.success) {
        setFile(null);
        const fileInput = document.getElementById(
          'file-upload'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateCustomer = (updatedCustomer: any) => {
    setClients((prev) =>
      prev.map((customer) =>
        customer.Nome === updatedCustomer.Nome ? updatedCustomer : customer
      )
    );
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.'
      )
    ) {
      clearData();
      setUploadResult(null);
    }
  };

  const exportToExcel = () => {
    if (clients.length === 0) return;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const colWidths = Object.keys(clients[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...clients.map((row) => String(row[key] || '').length)
      ),
    }));
    worksheet['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    XLSX.writeFile(workbook, `clientes-${date}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#FDFFEE] font-[Inter]">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-300 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="text-[#002B28] w-7 h-7" />
              <h1 className="text-2xl font-bold text-[#002B28] tracking-tight">
                Tabela de Clientes
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {clients.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleClearData}
                    className="flex items-center gap-2 h-10 px-5 border-[#002B28] text-[#002B28] bg-[#FDFFEE] rounded-full hover:bg-[#00FFC6]/20 active:scale-95 hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Limpar Dados</span>
                  </Button>
                  <Button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 h-10 px-5 bg-[#002B28] text-white rounded-full hover:bg-[#001A18] active:scale-95 hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Exportar Excel</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6 animate-fade-in">
          {clients.length === 0 ? (
            <Card className="p-8 shadow-md bg-white rounded-2xl border border-gray-200">
              <div className="text-center mb-8">
                <Upload className="h-12 w-12 text-[#00FFC6] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#002B28] mb-2 tracking-tight">
                  Importar Dados dos Clientes
                </h2>
                <p className="text-gray-600 max-w-md mx-auto text-base">
                  Faça upload de um arquivo CSV contendo os dados dos seus
                  clientes.
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#00FFC6] transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 text-sm">
                        {file
                          ? file.name
                          : 'Clique para fazer upload do arquivo CSV'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {file
                          ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                          : ''}
                      </p>
                    </label>
                  </div>
                </div>
                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-[#002B28] text-white rounded-full hover:bg-[#001A18] active:scale-95 hover:scale-105 h-10 transition-all duration-300"
                  >
                    {uploading ? 'Processando...' : 'Importar Dados'}
                  </Button>
                )}
                {uploadResult && (
                  <div
                    className={`mt-4 p-4 rounded-xl ${
                      uploadResult.success
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    } transition-all`}
                  >
                    <div className="flex items-start">
                      {uploadResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <p
                        className={
                          uploadResult.success
                            ? 'text-green-700 text-sm'
                            : 'text-red-700 text-sm'
                        }
                      >
                        {uploadResult.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden shadow-md rounded-2xl bg-white border border-gray-200 animate-fade-in">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#002B28] tracking-tight">
                    Dados Importados ({clients.length} clientes)
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".csv"
                      id="file-upload-update"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload-update"
                      className="px-4 py-2 bg-white border border-[#002B28] text-[#002B28] rounded-full hover:bg-[#00FFC6]/20 transition-all cursor-pointer flex items-center gap-2 h-10 hover:scale-105 active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-[#002B28]" />
                      <span className="text-sm">Atualizar Dados</span>
                    </label>
                    {file && (
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-[#002B28] text-white hover:bg-[#001A18] active:scale-95 hover:scale-105 rounded-full h-10 transition-all"
                      >
                        {uploading ? 'Processando...' : 'Importar'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <CustomerTable
                customers={clients}
                onUpdateCustomer={handleUpdateCustomer}
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
