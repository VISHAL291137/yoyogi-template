import { useState, FormEvent } from 'react';
import { X, Tag, Plus, Check } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onAddTag: (newTag: string) => void;
}

export default function TagModal({ isOpen, onClose, tags, onAddTag }: TagModalProps) {
  const [newTagInput, setNewTagInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      onAddTag(newTagInput.trim());
      setNewTagInput('');
    }
  };

  const handleCopyTags = () => {
    const text = tags.map((t) => `#${t}`).join(' ');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div
        id="tag-modal-box"
        className="relative w-full max-w-lg overflow-y-auto bg-[#FAF7F2] text-[#1A1A1A] rounded-2xl border border-[#EAE3D6] shadow-2xl p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-200/60 text-neutral-600 hover:text-black transition-colors"
          aria-label="Close tag modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-[#ECE5D8] pb-5">
          <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#CD7F63] mb-1.5 font-sans">
            MODEL CATEGORIZATION & METADATA
          </div>
          <h3
            className="font-editorial-serif text-3xl font-normal text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
          >
            Editorial Tags & Credits
          </h3>
          <p className="text-xs text-[#595246] mt-1">
            Active indexing tags for fashion houses, runway casting directors, and editorial stylist credits.
          </p>
        </div>

        {/* Existing Tags */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#786F62] mb-3">
            Assigned Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-white border border-[#EAE3D6] px-3.5 py-1 rounded-full text-xs text-[#1A1A1A] font-medium shadow-xs"
              >
                <Tag className="w-3 h-3 text-[#CD7F63]" />
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Add Tag Form */}
        <form onSubmit={handleAdd} className="mb-6">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
            Add New Tag / Campaign Credit
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. MilanFW26 or HauteCouture"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 bg-white border border-[#EAE3D6] rounded-lg px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
            />
            <button
              type="submit"
              className="bg-[#1A1A1A] text-[#FAF7F2] hover:bg-[#333] px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-[#ECE5D8] flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyTags}
            className="text-xs text-[#786F62] hover:text-[#1A1A1A] font-medium tracking-wider uppercase flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-700">Copied to Clipboard</span>
              </>
            ) : (
              <span>Copy Tags (#)</span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1A1A1A] text-[#FAF7F2] hover:bg-[#333] px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
