'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Image, DollarSign, MapPin, CheckCircle, Upload, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '@/lib/api';

const CAR_MAKES = ['Toyota', 'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Subaru', 'Mercedes-Benz', 'BMW', 'Hyundai', 'Kia', 'Volkswagen', 'Audi', 'Ford', 'Other'];
const FUEL_TYPES = ['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'OTHER'];
const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC'];
const CONDITIONS = [
  { value: 'EXCELLENT', label: 'Excellent', desc: 'Like new, no defects' },
  { value: 'GOOD', label: 'Good', desc: 'Minor wear, runs perfectly' },
  { value: 'FAIR', label: 'Fair', desc: 'Some repairs needed' },
  { value: 'NEEDS_WORK', label: 'Needs Work', desc: 'Significant repairs needed' },
];
const PROVINCES = ['KIGALI', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN'];
const RWANDA_DISTRICTS: Record<string, string[]> = {
  KIGALI: ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  NORTHERN: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  SOUTHERN: ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  EASTERN: ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  WESTERN: ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
};
const IMPORT_ORIGINS = ['JAPAN', 'UAE', 'SOUTH_AFRICA', 'EUROPE', 'LOCAL', 'OTHER'];

const STEPS = [
  { number: 1, label: 'Vehicle Details', icon: Car },
  { number: 2, label: 'Photos', icon: Image },
  { number: 3, label: 'Price & Description', icon: DollarSign },
  { number: 4, label: 'Location', icon: MapPin },
  { number: 5, label: 'Review & Publish', icon: CheckCircle },
];

export default function PostListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    make: '', model: '', year: new Date().getFullYear().toString(),
    fuelType: 'PETROL', transmission: 'AUTOMATIC', mileageKm: '',
    condition: 'GOOD', importOrigin: 'JAPAN', hasServiceHistory: false,
    hasAccidentHistory: false, priceRwf: '', isNegotiable: false,
    description: '', videoUrl: '', province: 'KIGALI', district: '', sector: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 30));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return !!(formData.make && formData.model && formData.year && formData.mileageKm);
      case 2:
        return photos.length >= 3;
      case 3:
        return !!(formData.priceRwf && formData.description.length >= 20);
      case 4:
        return !!(formData.province && formData.district);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/listings', {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        mileageKm: parseInt(formData.mileageKm),
        condition: formData.condition,
        importOrigin: formData.importOrigin,
        hasServiceHistory: formData.hasServiceHistory,
        hasAccidentHistory: formData.hasAccidentHistory,
        priceRwf: parseInt(formData.priceRwf.replace(/,/g, '')),
        isNegotiable: formData.isNegotiable,
        description: formData.description,
        province: formData.province,
        district: formData.district,
        sector: formData.sector || undefined,
        videoUrl: formData.videoUrl || undefined,
      });

      const listingId = response.data.data.id;

      if (photos.length > 0) {
        const photoFormData = new FormData();
        photos.forEach((photo) => photoFormData.append('photos', photo.file));
        await apiClient.post(`/api/v1/uploads/${listingId}/photos`, photoFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      router.push(`/cars/${response.data.data.slug}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const formatPrice = (value: string) => {
    const num = parseInt(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  const usdEstimate = (() => {
    const num = parseInt(formData.priceRwf.replace(/,/g, ''));
    return isNaN(num) ? 0 : (num * 0.00078).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  })();

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Post Your Car</h1>

        {/* Step Indicator */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step > s.number ? 'bg-success text-white' :
                    step === s.number ? 'bg-gold text-navy' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.number ? <CheckCircle size={20} /> : <s.icon size={18} />}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:block ${
                    step >= s.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s.number ? 'bg-success' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* STEP 1: Vehicle Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Car size={20} className="text-gold" /> Vehicle Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                  <select value={formData.make} onChange={(e) => updateField('make', e.target.value)} className="input w-full" required>
                    <option value="">Select Make</option>
                    {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input type="text" value={formData.model} onChange={(e) => updateField('model', e.target.value)} className="input w-full" placeholder="e.g. Camry" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <select value={formData.year} onChange={(e) => updateField('year', e.target.value)} className="input w-full">
                    {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                  <input type="number" value={formData.mileageKm} onChange={(e) => updateField('mileageKm', e.target.value)} className="input w-full" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {FUEL_TYPES.map((f) => (
                    <button key={f} type="button" onClick={() => updateField('fuelType', f)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.fuelType === f ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <div className="flex gap-2">
                  {TRANSMISSIONS.map((t) => (
                    <button key={t} type="button" onClick={() => updateField('transmission', t)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.transmission === t ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {CONDITIONS.map((c) => (
                    <button key={c.value} type="button" onClick={() => updateField('condition', c.value)}
                      className={`p-3 rounded-lg border text-left transition-colors ${formData.condition === c.value ? 'border-gold bg-gold-pale' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-xs text-gray-500">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Import Origin</label>
                  <select value={formData.importOrigin} onChange={(e) => updateField('importOrigin', e.target.value)} className="input w-full">
                    {IMPORT_ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.hasServiceHistory} onChange={(e) => updateField('hasServiceHistory', e.target.checked)} className="w-4 h-4" />
                    Has service history
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.hasAccidentHistory} onChange={(e) => updateField('hasAccidentHistory', e.target.checked)} className="w-4 h-4" />
                    Has accident history
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Photos */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Image size={20} className="text-gold" /> Photos ({photos.length}/30)
              </h2>
              <p className="text-sm text-gray-600">Minimum 3 photos required. Drag to reorder. First photo will be the cover.</p>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                    <img src={photo.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-2 left-2 bg-gold text-navy text-xs px-2 py-1 rounded font-medium">Cover</div>
                    )}
                    <button onClick={() => removePhoto(i)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {photos.length < 30 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gold transition-colors">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add Photos</span>
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoUpload} className="hidden" />

              {photos.length < 3 && (
                <div className="bg-warning-pale text-warning px-4 py-3 rounded-lg text-sm">
                  Please upload at least 3 photos to continue
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Price & Description */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign size={20} className="text-gold" /> Price & Description
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (RWF) *</label>
                <input type="text" value={formData.priceRwf} onChange={(e) => updateField('priceRwf', formatPrice(e.target.value))} className="input w-full text-2xl font-bold text-gold" placeholder="5,000,000" required />
                {formData.priceRwf && <p className="text-sm text-gray-400 mt-1">≈ ${usdEstimate}</p>}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.isNegotiable} onChange={(e) => updateField('isNegotiable', e.target.checked)} className="w-4 h-4" />
                Price is negotiable
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} className="input w-full" rows={5} placeholder="Describe your car's condition, features, maintenance history..." maxLength={2000} required />
                <div className="text-right text-sm text-gray-400 mt-1">{formData.description.length}/2000</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video Link (optional)</label>
                <input type="url" value={formData.videoUrl} onChange={(e) => updateField('videoUrl', e.target.value)} className="input w-full" placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MapPin size={20} className="text-gold" /> Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                  <select value={formData.province} onChange={(e) => { updateField('province', e.target.value); updateField('district', ''); }} className="input w-full">
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                  <select value={formData.district} onChange={(e) => updateField('district', e.target.value)} className="input w-full">
                    <option value="">Select District</option>
                    {RWANDA_DISTRICTS[formData.province]?.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector (optional)</label>
                <input type="text" value={formData.sector} onChange={(e) => updateField('sector', e.target.value)} className="input w-full" placeholder="e.g. Kimironko" />
              </div>
            </div>
          )}

          {/* STEP 5: Review & Publish */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle size={20} className="text-gold" /> Review & Publish
              </h2>
              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex gap-4">
                  {photos.length > 0 && (
                    <img src={photos[0].preview} alt="Cover" className="w-32 h-24 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{formData.year} {formData.make} {formData.model}</h3>
                    <p className="text-2xl font-bold text-gold">RWF {formData.priceRwf}</p>
                    {formData.isNegotiable && <span className="badge-featured px-2 py-1 text-xs rounded">Negotiable</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Fuel:</span> {formData.fuelType}</div>
                  <div><span className="text-gray-500">Transmission:</span> {formData.transmission}</div>
                  <div><span className="text-gray-500">Mileage:</span> {parseInt(formData.mileageKm).toLocaleString()} km</div>
                  <div><span className="text-gray-500">Condition:</span> {formData.condition}</div>
                  <div><span className="text-gray-500">Origin:</span> {formData.importOrigin}</div>
                  <div><span className="text-gray-500">Location:</span> {formData.district}, {formData.province}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Description:</span>
                  <p className="text-sm mt-1 text-gray-700 line-clamp-3">{formData.description}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Photos:</span> {photos.length} uploaded
                </div>
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4 mt-0.5" required />
                <span>I agree to the <a href="/terms" className="text-gold underline">Terms of Service</a> and confirm this listing is accurate</span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                <ChevronLeft size={18} /> Back
              </button>
            )}
            {step < 5 ? (
              <button type="button" onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button type="button" onClick={handlePublish} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Publishing...' : 'Publish Listing'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
