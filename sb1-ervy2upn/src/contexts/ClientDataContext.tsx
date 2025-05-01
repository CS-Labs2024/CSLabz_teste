import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer } from '../types';
import { supabase } from '../lib/supabase';

interface ClientDataContextType {
  clients: Customer[];
  setClients: React.Dispatch<React.SetStateAction<Customer[]>>;
  loading: boolean;
  error: string | null;
  uploadCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  clearData: () => void;
}

const ClientDataContext = createContext<ClientDataContextType | undefined>(undefined);

export function ClientDataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const savedData = localStorage.getItem('clientData');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setClients(parsedData);
        }
      } catch (err) {
        console.error('Error loading client data:', err);
        setError('Failed to load saved client data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('clientData', JSON.stringify(clients));
    }
  }, [clients]);

  const uploadCSV = async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        resolve({ success: false, message: 'Por favor, envie um arquivo CSV' });
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(header => header.trim());
          
          // Validate required columns
          const requiredColumns = ['Nome', 'Tier', 'MRR', 'Produto', 'UltimoContato'];
          const missingColumns = requiredColumns.filter(col => 
            !headers.some(header => header.includes(col))
          );
          
          if (missingColumns.length > 0) {
            resolve({ 
              success: false, 
              message: `Colunas obrigatórias ausentes: ${missingColumns.join(', ')}` 
            });
            return;
          }
          
          // Process data
          const parsedClients: Customer[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(value => value.trim());
            if (values.length !== headers.length) {
              continue; // Skip malformed lines
            }
            
            const client: any = {};
            headers.forEach((header, index) => {
              client[header] = values[index];
            });
            
            // Add empty activities array if not present
            if (!client.atividades) {
              client.atividades = [];
            }
            
            // Calculate days without touch if possible
            if (client.UltimoContato) {
              const lastContact = new Date(client.UltimoContato);
              const today = new Date();
              const diffTime = Math.abs(today.getTime() - lastContact.getTime());
              client.DiasSemTouch = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            parsedClients.push(client);
          }
          
          if (parsedClients.length === 0) {
            resolve({ success: false, message: 'Nenhum dado válido encontrado no arquivo' });
            return;
          }
          
          setClients(parsedClients);
          resolve({ 
            success: true, 
            message: `${parsedClients.length} clientes importados com sucesso` 
          });
          
        } catch (err) {
          console.error('Error parsing CSV:', err);
          resolve({ success: false, message: 'Erro ao processar o arquivo CSV' });
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, message: 'Erro ao ler o arquivo' });
      };
      
      reader.readAsText(file);
    });
  };

  const clearData = () => {
    setClients([]);
    localStorage.removeItem('clientData');
  };

  return (
    <ClientDataContext.Provider 
      value={{ 
        clients, 
        setClients, 
        loading, 
        error, 
        uploadCSV,
        clearData
      }}
    >
      {children}
    </ClientDataContext.Provider>
  );
}

export function useClientData() {
  const context = useContext(ClientDataContext);
  if (context === undefined) {
    throw new Error('useClientData must be used within a ClientDataProvider');
  }
  return context;
}