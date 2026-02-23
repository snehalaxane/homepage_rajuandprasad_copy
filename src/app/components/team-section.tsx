import { motion } from 'motion/react';
import { Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  expertise: string;
  image: string;
  linkedin?: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'CA. K. K. Waghela',
    role: 'Senior Partner',
    expertise: 'Audit & Assurance, Corporate Law',
    image: 'figma:asset/d65eefa8d0d70588b92fdee19ec6044c0c89caa9.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
  {
    name: 'CA. Raju Kumar',
    role: 'Senior Partner',
    expertise: 'Taxation, Financial Consultancy',
    image: 'figma:asset/6dc8a9a0737c58ea082e97f74d6751b5517af7d2.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
  {
    name: 'CA. Prasad Reddy',
    role: 'Partner',
    expertise: 'Special Audits, Regulatory Compliance',
    image: 'figma:asset/21db65003de6029325dce27daafe525a69354d4e.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
  {
    name: 'CA. Sharma',
    role: 'Partner',
    expertise: 'Foreign Exchange, Advisory Services',
    image: 'figma:asset/0a4dcb7943102f5d073e42d317f096b5c4d0c1fb.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
  {
    name: 'CA. Krishna',
    role: 'Partner',
    expertise: 'Project Consultancy, Management Services',
    image: 'figma:asset/7071c72ab53d124c076e67b9ce4f31ec93d89e24.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
  {
    name: 'CA. Venkatesh',
    role: 'Partner',
    expertise: 'Enterprise Restructuring, Banking',
    image: 'figma:asset/b805158ca11b3a18773e2fca91e5dfbc15cdf2d1.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
  {
    name: 'CA. Rajesh',
    role: 'Partner',
    expertise: 'Systems Design, Information Systems Audit',
    image: 'figma:asset/631761782b4105549facd512c089f0f2f4dd4db0.png',
    linkedin: '#',
    email: 'partner@rajuprasad.com',
  },
];

export function TeamSection() {
  return (
    <section id="team" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#022683]/10 text-[#022683] rounded-full text-sm font-semibold">
              Our Leadership
            </span>
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#022683]">Partners</span>
          </h2>
          <p className="text-lg text-[#888888] max-w-2xl mx-auto">
            Experienced & dedicated Chartered Accountant Professionals with expertise across various sectors
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-square">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022683]/90 via-[#022683]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Social Links - appears on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#022683] hover:text-white transition-all shadow-lg hover:scale-110"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#022683] hover:text-white transition-all shadow-lg hover:scale-110"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#022683] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#022683] mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {member.expertise}
                  </p>
                </div>

                {/* Decorative border on hover */}
                <div className="absolute inset-0 border-2 border-[#022683] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-[#888888] mb-4">
            Want to work with our expert team?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#022683] text-white rounded-lg hover:bg-[#011952] transition-all hover:scale-105 shadow-lg shadow-[#022683]/30"
          >
            Schedule a Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}