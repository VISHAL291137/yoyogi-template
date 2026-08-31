import { useState, FormEvent } from 'react';
import { X, Mail, Check } from 'lucide-react';
import { ModelInfo } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: ModelInfo;
}

export default function BookingModal({ isOpen, onClose, modelInfo }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectType, setProjectType] = useState('Campaign');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div
        id="booking-modal-box"
        className="relative w-full max-w-lg overflow-y-auto bg-[#FAF7F2] text-[#1A1A1A] rounded-2xl border border-[#EAE3D6] shadow-2xl p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-200/60 text-neutral-600 hover:text-black transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 border-b border-[#ECE5D8] pb-5">
          <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#CD7F63] mb-1.5 font-sans">
            AGENCY BOOKING INQUIRY
          </div>
          <h3
            className="font-editorial-serif text-3xl font-normal text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
          >
            Direct Representation
          </h3>
          <p className="text-xs text-[#595246] mt-1">
            Request official PDF comp-card, runway availability, and commercial rates for {modelInfo.name}.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#CD7F63]/15 text-[#CD7F63] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4
              className="font-editorial-serif text-2xl text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              Inquiry Sent to Agency
            </h4>
            <p className="text-xs text-[#595246] max-w-xs mx-auto">
              The booking desk at {modelInfo.agency} will reply within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#786F62] mb-1">
                Your Brand / Agency Name
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Maison de Haute Couture"
                className="w-full bg-white border border-[#EAE3D6] rounded-lg px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#786F62] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="casting@brand.com"
                className="w-full bg-white border border-[#EAE3D6] rounded-lg px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#786F62] mb-1">
                Booking Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-white border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
              >
                <option value="Editorial">Editorial Magazine Spread</option>
                <option value="Runway">Fashion Week Runway Show</option>
                <option value="Campaign">Global Brand Campaign & Lookbook</option>
                <option value="Direct">Direct Private Booking</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#ECE5D8] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#1A1A1A] text-[#1A1A1A] px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#1A1A1A] text-[#FAF7F2] hover:bg-[#333] px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#CD7F63]" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
