import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-navy-100 last:border-0">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-navy-900 font-medium pr-8 group-hover:text-green-600 transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-navy-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-navy-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
