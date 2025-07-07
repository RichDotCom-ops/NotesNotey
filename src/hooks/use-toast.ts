
import * as React from 'react';

type Toast = {
  title: string;
  description: string;
  variant?: 'success' | 'error' | 'info';
};

let setToastState: ((toast: Toast | null) => void) | null = null;

export const ToastContainer: React.FC = () => {
  const [toast, setToast] = React.useState<Toast | null>(null);
  React.useEffect(() => {
    setToastState = setToast;
    return () => {
      setToastState = null;
    };
  }, []);
  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  if (!toast) return null;
  const type = toast.variant || 'info';
  return React.createElement(
    'div',
    { className: 'fixed top-6 left-1/2 z-50', style: { transform: 'translateX(-50%)' } },
    React.createElement(
      'div',
      {
        className:
          'px-6 py-3 rounded-lg shadow-lg text-white font-semibold flex items-center gap-3 ' +
          (type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'),
        role: 'alert',
      },
      React.createElement('span', null, toast.title),
      toast.description ? React.createElement('span', { className: 'ml-2 font-normal' }, toast.description) : null,
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => setToast(null),
          className: 'ml-4 text-white/80 hover:text-white text-lg',
        },
        '\u00d7'
      )
    )
  );
};

export function useToast() {
  return {
    toast: ({ title, description, variant }: Toast) => {
      if (setToastState) {
        setToastState({ title, description, variant });
      }
    },
  };
}
