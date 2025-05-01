import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart2,
  AlertTriangle,
  Target,
  Grid,
  LogOut,
  CreditCard,
  Database,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('subscription_status')
          .maybeSingle();
          
        if (error) throw error;
        
        // Check if user has an active subscription
        setHasSubscription(
          data?.subscription_status === 'active' || 
          data?.subscription_status === 'trialing'
        );
      } catch (err) {
        console.error('Error checking subscription:', err);
      }
    }
    
    checkSubscription();
  }, []);

  const menuItems = [
    {
      group: 'DADOS',
      items: [
        {
          name: 'Tabela de Clientes',
          path: '/dashboard/clients',
          icon: Database,
        },
      ],
    },
    {
      group: 'ANÁLISES',
      items: [
        {
          name: 'Análise de Cohort',
          path: '/dashboard/cohort',
          icon: BarChart2,
        },
        {
          name: 'Gestão de Risco',
          path: '/dashboard/risk',
          icon: AlertTriangle,
        },
        {
          name: 'Cobertura de Carteira',
          path: '/dashboard/coverage',
          icon: Target,
        },
        { name: 'Matriz RFV', path: '/dashboard/rfv', icon: Grid },
      ],
    },
    {
      group: 'CONFIGURAÇÕES',
      items: [
        { 
          name: 'Assinatura', 
          path: '/pricing', 
          icon: CreditCard,
          badge: !hasSubscription ? 'Ativar' : undefined,
          badgeColor: !hasSubscription ? 'bg-yellow-400 text-yellow-800' : undefined
        }
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-[#002b28] h-screen fixed left-0 top-0 text-white flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="h-8 md:h-12 flex items-center">
          <img 
            src="https://i.postimg.cc/0Q32pZbR/logo-png.png" 
            alt="CS LABZ" 
            className="h-8 md:h-12"
          />
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto scrollbar-none">
        {menuItems.map((group, idx) => (
          <div key={idx} className="mb-8 px-4">
            <h3 className="text-xs font-semibold text-[#00FFC6] mb-4 px-2">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={itemIdx}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-[#00FFC6] text-[#002b28]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon
                          className={`w-5 h-5 ${
                            active ? 'text-[#002b28]' : 'text-[#00FFC6]'
                          } mr-3`}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`text-xs px-2 py-1 rounded-full ${item.badgeColor || 'bg-blue-400 text-blue-800'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="mb-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <Settings className="w-5 h-5 mr-3" />
            <span className="text-sm">Configurações</span>
            {showSettings ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {showSettings && (
            <div className="mt-2 ml-4 pl-4 border-l border-white/10 space-y-2">
              <Link
                to="/pricing"
                className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="text-sm">Gerenciar Assinatura</span>
              </Link>
            </div>
          )}
        </div>
        
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}