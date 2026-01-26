'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  Search,
  Plus,
  Users,
  MapPin,
  MoreVertical,
  LayoutGrid,
  CheckCircle2,
  Clock,
  HelpCircle, // Đổi icon mặc định cho đẹp hơn
  LucideIcon
} from 'lucide-react';
import api from '@/constants/api';

// --- Types ---
interface Ban {
  id: {
    maBan: number;
    idRestaurant: number;
  };
  tenBan: string;
  sucChua: number;
  trangThai: boolean;
  viTri?: string;
}

interface StatusConfigItem {
  color: string;
  badgeBg: string;
  badgeBorder: string;
  icon: LucideIcon;
  cardBorder: string;
  cardBg: string;
  stripColor: string;
  hoverShadow: string;
  label: string;
}

// --- Configuration ---
const STATUS_CONFIG: Record<string, StatusConfigItem> = {
  'false': { // Trống
    label: 'Bàn Trống',
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-100',
    badgeBorder: 'border-emerald-200',
    icon: CheckCircle2,
    cardBorder: 'border-emerald-200',
    cardBg: 'bg-emerald-50/60',
    stripColor: 'bg-emerald-500',
    hoverShadow: 'hover:shadow-emerald-500/20'
  },
  'true': { // Có khách
    label: 'Đang Phục Vụ',
    color: 'text-orange-700',
    badgeBg: 'bg-orange-100',
    badgeBorder: 'border-orange-200',
    icon: Clock,
    cardBorder: 'border-orange-200',
    cardBg: 'bg-orange-50/60',
    stripColor: 'bg-orange-500',
    hoverShadow: 'hover:shadow-orange-500/20'
  },
  'default': {
    label: 'Chưa xác định',
    color: 'text-slate-700', // Đậm hơn
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-300', // Viền đậm hơn
    icon: HelpCircle,
    cardBorder: 'border-slate-300', // Viền thẻ đậm hơn
    cardBg: 'bg-white',
    stripColor: 'bg-slate-500', // Thanh bên đậm hơn
    hoverShadow: 'hover:shadow-slate-400/20'
  }
};

export default function BanPage() {
  const router = useRouter();
  const [bans, setBans] = useState<Ban[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchBans = async () => {
      try {
        const response = await api.get('/ban');
        if (response.status === 200) {
          setBans(response.data);
        } else {
          throw new Error('Failed to fetch tables');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Đã xảy ra lỗi không xác định');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBans();
  }, [router]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: bans.length,
      available: bans.filter(b => b.trangThai === false).length,
      serving: bans.filter(b => b.trangThai === true).length,
    };
  }, [bans]);

  // Filter Logic
  const filteredBans = useMemo(() => {
    return bans.filter(ban => {
      const matchesStatus = filterStatus === 'All' || String(ban.trangThai) === filterStatus;
      const matchesSearch = ban.tenBan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ban.viTri && ban.viTri.toLowerCase().includes(searchTerm.toLowerCase())) || false;
      return matchesStatus && matchesSearch;
    });
  }, [bans, filterStatus, searchTerm]);

  // Skeleton
  const TableSkeleton = () => (
      <div className="animate-pulse bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden"> {/* Border đậm hơn chút */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-300"></div>
        <div className="pl-3">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-5 w-20 bg-gray-300 rounded-full mb-4"></div>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="flex gap-4 mt-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
  );

  if (error) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans">
          {/* ... Error Component giữ nguyên ... */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
            <p className="text-gray-700 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Thử lại</button>
          </div>
        </div>
    );
  }

  return (
      <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
        <Sidebar />

        <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Quản lý Bàn</h1>
              <p className="text-slate-600 mt-1 text-sm font-medium">Theo dõi trạng thái và sắp xếp bàn ăn</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all font-medium">
              <Plus size={20} strokeWidth={2.5} />
              <span>Thêm Bàn Mới</span>
            </button>
          </header>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Tổng số bàn', val: stats.total, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200' },
              { label: 'Bàn Trống', val: stats.available, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
              { label: 'Đang phục vụ', val: stats.serving, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
            ].map((item, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border shadow-sm ${item.bg} ${item.border}`}>
                  <p className="text-sm text-slate-600 font-semibold mb-1">{item.label}</p>
                  <p className={`text-3xl font-bold ${item.color}`}>{item.val}</p>
                </div>
            ))}
          </div>

          {/* Toolbar & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-10">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto border border-slate-200">
              {[
                { id: 'All', label: 'Tất cả' },
                { id: 'false', label: 'Trống' },
                { id: 'true', label: 'Đang phục vụ' }
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                          filterStatus === tab.id
                              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                  >
                    {tab.label}
                  </button>
              ))}
            </div>

            {/* Search Bar - ĐÃ SỬA MÀU ĐẬM HƠN */}
            <div className="relative w-full md:w-80 group">
              <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors"
                  size={20}
              />
              <input
                  type="text"
                  placeholder="Tìm theo tên ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50
                    text-slate-900 placeholder:text-slate-500 font-medium
                    focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600
                    outline-none transition-all text-sm
                  "
              />
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <TableSkeleton key={i} />)}
              </div>
          ) : filteredBans.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-slate-100 p-4 rounded-full w-fit mx-auto mb-4 text-slate-500 border border-slate-200">
                  <LayoutGrid size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Không tìm thấy bàn nào</h3>
                <p className="text-slate-600 mt-2 font-medium">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBans.map((ban) => {
                  const statusKey = String(ban.trangThai);
                  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG['default'];
                  const StatusIcon = statusConfig.icon;

                  return (
                      <div
                          key={ban.id.maBan}
                          className={`
                            group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden
                            ${statusConfig.cardBg} 
                            ${statusConfig.cardBorder}
                            ${statusConfig.hoverShadow}
                            hover:-translate-y-1 hover:shadow-xl
                          `}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusConfig.stripColor}`}></div>

                        <div className="pl-2">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                {ban.tenBan}
                              </h2>
                              {/* Badge đậm hơn */}
                              <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeBorder} ${statusConfig.badgeBg} ${statusConfig.color}`}>
                                <StatusIcon size={14} strokeWidth={2.5} />
                                {statusConfig.label}
                              </span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-700 p-2 hover:bg-white/60 rounded-full transition-colors">
                              <MoreVertical size={20} />
                            </button>
                          </div>

                          <div className="border-t border-slate-200/60 my-4"></div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-slate-600 text-sm">
                              <div className="flex items-center gap-2 font-medium">
                                <Users size={18} className={statusConfig.color} />
                                <span className="text-slate-600">Sức chứa:</span>
                              </div>
                              <span className="font-bold text-slate-900">{ban.sucChua} người</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </main>
      </div>
  );
}