import { motion } from 'motion/react';
import { Linkedin, Twitter, Facebook, Instagram, Mail, Phone } from 'lucide-react';

const quickLinks = [
  'Home',
  'About Us',
  'Our Services',
  'Infrastructure',
  'Contact Us',
  'Careers',
];

const searchFor = [
  'Audit Services',
  'Tax Consultancy',
  'Business Advisory',
  'Financial Planning',
  'Regulatory Compliance',
  'Special Audits',
];

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              About
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Raju and Prasad is one of the firms of Chartered Accountants in Hyderabad with experienced & dedicated Chartered Accountant Professionals. The firm has been handling variety of assignments in various sectors. The partners of the firm have experience in specific areas. The firm was established in the year 1979 in Hyderabad and has its branches in Mumbai, Bangalore, Thane, Chennai, Tirupati and Vijayawada.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+914023314657"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>+91 40 2331 4657</span>
              </a>
              <a
                href="mailto:info@rajuprasad.com"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>info@rajuprasad.com</span>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Your Search For */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-bold text-lg mb-6">Your Search For</h4>
            <ul className="space-y-3">
              {searchFor.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect With Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold text-lg mb-6">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all group"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                );
              })}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Follow us on social media for updates on tax laws, regulations, and business insights.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Raju & Prasad - Chartered Accountants. All rights reserved.</p>
            <p className="text-center">
              Member of the Institute of Chartered Accountants of India (ICAI)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
