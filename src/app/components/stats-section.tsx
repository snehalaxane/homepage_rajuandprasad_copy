import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Award, Users, Briefcase, TrendingUp } from 'lucide-react';

interface Stat {
  icon: typeof Award;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: Award,
    value: 46,
    suffix: '+',
    label: 'Years of Excellence',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Satisfied Clients',
  },
  {
    icon: Briefcase,
    value: 7,
    suffix: '',
    label: 'Office Locations',
  },
  {
    icon: TrendingUp,
    value: 1000,
    suffix: '+',
    label: 'Projects Completed',
  },
];

function Counter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const increment = value / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        setHasAnimated(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, hasAnimated]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 200 }}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors"
                >
                  <Icon className="h-8 w-8 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-4xl lg:text-5xl font-bold text-white mb-2"
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
