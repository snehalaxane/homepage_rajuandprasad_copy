import { motion } from 'motion/react';
import { FileCheck, Calculator, ClipboardList, Globe, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: FileCheck,
    title: 'Audit and Assurance',
    description:
      'Comprehensive audit services ensuring compliance and accuracy in financial reporting. Our experienced team provides thorough examination of financial statements and internal controls.',
  },
  {
    icon: Calculator,
    title: 'Taxation (Direct and Indirect)',
    description:
      'Expert tax planning and compliance services for both direct and indirect taxes. We help optimize your tax position while ensuring full regulatory compliance.',
  },
  {
    icon: ClipboardList,
    title: 'Special Audits',
    description:
      'Specialized audit services tailored to specific requirements including stock audits, bank audits, and forensic audits for comprehensive financial oversight.',
  },
  {
    icon: Globe,
    title: 'Foreign Exchange and Regulatory Matters',
    description:
      'Professional guidance on FEMA regulations, foreign exchange transactions, and cross-border compliance to facilitate smooth international operations.',
  },
  {
    icon: TrendingUp,
    title: 'Financial Consultancy',
    description:
      'Strategic financial advisory services including business valuation, financial restructuring, and capital raising to support your growth objectives.',
  },
  {
    icon: Lightbulb,
    title: 'Advisory Services',
    description:
      'Comprehensive business advisory covering strategic planning, risk management, and operational efficiency to help achieve your business goals.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary)] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-[var(--secondary)] max-w-2xl mx-auto">
            Comprehensive solutions tailored to meet all your accounting, taxation, and business needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-[var(--primary)] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />

                <div className="relative">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="w-14 h-14 rounded-xl bg-[var(--primary)] flex items-center justify-center mb-6 shadow-lg shadow-[var(--primary)]/30 group-hover:shadow-xl group-hover:shadow-[var(--primary)]/40 transition-all"
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--primary)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[var(--secondary)] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Link */}
                  <motion.a
                    href="#"
                    className="inline-flex items-center text-[var(--primary)] font-semibold group/link hover:text-[#011952] transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
