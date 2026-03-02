'use client';

/**
 * ToggleSwitch - Animated mode toggle with icon and label.
 */
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
    label: string;
    active: boolean;
    onToggle: () => void;
    icon?: React.ReactNode;
    activeColor?: string;
}

export default function ToggleSwitch({
    label,
    active,
    onToggle,
    icon,
    activeColor = 'bg-teal-500',
}: ToggleSwitchProps) {
    return (
        <motion.button
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 ${active
                    ? 'bg-slate-800/75 border-teal-300/45 shadow-lg shadow-teal-500/20'
                    : 'bg-slate-900/55 border-slate-600/35 hover:bg-slate-800/70 hover:border-slate-400/40'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
        >
            {icon && <span className="text-lg">{icon}</span>}

            <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400'}`}>
                {label}
            </span>

            {/* Toggle indicator */}
            <div
                className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${active ? activeColor : 'bg-gray-700'
                    }`}
            >
                <motion.div
                    className="w-3.5 h-3.5 bg-white rounded-full absolute top-[3px]"
                    animate={{ x: active ? 18 : 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </motion.button>
    );
}
