import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function ContactNewsletterSection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact Us */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-200/50">
              <h2 className="text-3xl font-bold text-[var(--primary)] mb-2">Contact Us</h2>
              <p className="text-[var(--secondary)] mb-8">Get in touch with our team</p>

              <div className="space-y-6">
                {/* Head Office */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-6 border border-blue-100"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Head Office</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Door No. 6-3-1090/A/1/1, 3rd Floor,<br />
                        Beside Laxmi Hyundai Showroom,<br />
                        Rajbhavan Road, Somajiguda,<br />
                        Hyderabad - 500082, Telangana
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Phone className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--secondary)] mb-1">Phone</div>
                    <div className="font-semibold text-gray-900">+91 40 2331 4657</div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Mail className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--secondary)] mb-1">Email</div>
                    <div className="font-semibold text-gray-900">info@rajuprasad.com</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-[var(--primary)] to-[#033099] rounded-3xl p-8 lg:p-10 shadow-xl text-white h-full">
              <h2 className="text-3xl font-bold mb-2">Stay Updated</h2>
              <p className="text-blue-100 mb-8">
                Subscribe to receive updates on tax laws, regulations, and business insights
              </p>

              <form className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">Enter Name</label>
                  <Input
                    placeholder="Your full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 h-12 rounded-xl backdrop-blur-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2">Your Mail</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 h-12 rounded-xl backdrop-blur-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium mb-2">Your Message</label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 rounded-xl backdrop-blur-sm resize-none"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-white text-[var(--primary)] hover:bg-gray-100 shadow-lg h-12 rounded-xl font-semibold group"
                  >
                    Subscribe Now
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
