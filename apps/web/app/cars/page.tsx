'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Grid, List, X, SlidersHorizontal } from 'lucide-react';
import CarCard from '@/components/CarCard';

const CAR_MAKES = ['Toyota', 'Nissan', 'Honda', 'Mazda', 'Mercedes-Benz', 'BMW', 'Hyundai', 'Kia'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'];
const IMPORT_ORIGINS = ['Japan', 'UAE', 'South Africa', 'Europe', 'Local'];

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    yearMin: searchParams.get('year_min') || '',
    yearMax: searchParams.get('year_max') || '',
    priceMin: searchParams.get('price_min') || '',
    priceMax: searchParams.get('price_max') || '',
    fuelType: searchParams.get('fuel_type') || '',
    transmission: searchParams.get('transmission') || '',
    condition: searchParams.get('condition') || '',
    province: searchParams.get('province') || '',
    importOrigin: searchParams.get('import_origin') || '',
    sellerType: searchParams.get('seller_type') || '',
    sort: searchParams.get('sort') || 'newest',
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        params.set('page', page.toString());
        params.set('limit', '20');

        const res = await fetch(`/api/v1/listings?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
          setTotalPages(data.meta?.pages || 1);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [filters, page]);

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'sort');

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: '' }));
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Browse Cars
            <span className="text-gray-400 text-lg font-normal ml-2">
              ({loading ? '...' : results.length} results)
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="input"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Lowest Price</option>
              <option value="price_high">Highest Price</option>
              <option value="most_viewed">Most Viewed</option>
            </select>
            <div className="flex border rounded-md overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-gold text-navy' : 'bg-white'}`}>
                <Grid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-gold text-navy' : 'bg-white'}`}>
                <List size={18} />
              </button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden btn-secondary flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(([key, value]) => (
              <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-navy text-white text-sm rounded-full">
                {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                <button onClick={() => removeFilter(key)} className="ml-1 hover:text-gold">
                  <X size={14} />
                </button>
              </span>
            ))}
            <button onClick={() => setFilters({ make: '', model: '', yearMin: '', yearMax: '', priceMin: '', priceMax: '', fuelType: '', transmission: '', condition: '', province: '', importOrigin: '', sellerType: '', sort: 'newest' })} className="text-sm text-gold hover:underline">
              Clear All
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:p-0' : 'hidden md:block'} w-full md:w-72 flex-shrink-0`}>
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                <select value={filters.make} onChange={(e) => updateFilter('make', e.target.value)} className="input w-full">
                  <option value="">All Makes</option>
                  {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (RWF)</label>
                <div className="flex gap-2">
                  <input type="number" value={filters.priceMin} onChange={(e) => updateFilter('priceMin', e.target.value)} placeholder="Min" className="input w-1/2" />
                  <input type="number" value={filters.priceMax} onChange={(e) => updateFilter('priceMax', e.target.value)} placeholder="Max" className="input w-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <div className="flex gap-2">
                  <input type="number" value={filters.yearMin} onChange={(e) => updateFilter('yearMin', e.target.value)} placeholder="From" className="input w-1/2" />
                  <input type="number" value={filters.yearMax} onChange={(e) => updateFilter('yearMax', e.target.value)} placeholder="To" className="input w-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <div className="space-y-1">
                  {FUEL_TYPES.map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={filters.fuelType === f} onChange={() => updateFilter('fuelType', filters.fuelType === f ? '' : f)} className="w-4 h-4" />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <div className="space-y-1">
                  {['Manual', 'Automatic'].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="transmission" checked={filters.transmission === t} onChange={() => updateFilter('transmission', t)} className="w-4 h-4" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                <div className="space-y-1">
                  {PROVINCES.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={filters.province === p} onChange={() => updateFilter('province', filters.province === p ? '' : p)} className="w-4 h-4" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Import Origin</label>
                <div className="space-y-1">
                  {IMPORT_ORIGINS.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={filters.importOrigin === o} onChange={() => updateFilter('importOrigin', filters.importOrigin === o ? '' : o)} className="w-4 h-4" />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller Type</label>
                <div className="space-y-1">
                  {[['', 'Any'], ['private', 'Private'], ['dealer', 'Dealer']].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="sellerType" checked={filters.sellerType === val} onChange={() => updateFilter('sellerType', val)} className="w-4 h-4" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16">
                <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">No cars match your filters. Try adjusting your search criteria.</p>
                <button onClick={() => setFilters({ make: '', model: '', yearMin: '', yearMax: '', priceMin: '', priceMax: '', fuelType: '', transmission: '', condition: '', province: '', importOrigin: '', sellerType: '', sort: 'newest' })} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {results.map((listing: any) => (
                    <CarCard key={listing.id} featured={listing.isFeatured} verified={listing.user?.isIdVerified} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50">
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-md ${page === p ? 'bg-gold text-navy font-bold' : 'bg-white border hover:bg-gray-100'}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary disabled:opacity-50">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
