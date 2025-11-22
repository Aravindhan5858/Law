import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/TestimonialCards.css';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface TestimonialCardsProps {
  testimonials?: Testimonial[];
  bgImage?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    text: "This legal advisor platform helped me understand my rights clearly. The AI analysis was spot-on and gave me the confidence to proceed with my case.",
    name: "Thomas Phillips",
    role: "Business Owner",
    avatarUrl: ""
  },
  {
    id: 2,
    text: "I was confused about the legal implications of my situation. This tool provided clear guidance and helped me find the right legal sections quickly.",
    name: "Priya Sharma",
    role: "Teacher",
    avatarUrl: ""
  },
  {
    id: 3,
    text: "The instant analysis and recommendations saved me hours of research. Highly recommend this platform for anyone seeking legal clarity.",
    name: "Rajesh Kumar",
    role: "Entrepreneur",
    avatarUrl: ""
  }
];

const TestimonialCards: React.FC<TestimonialCardsProps> = ({ 
  testimonials = defaultTestimonials,
  bgImage 
}) => {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <>
      <section 
        ref={sectionRef}
        className={`testimonials-section ${theme}`}
        aria-labelledby="testimonials-heading"
      >
        <div className="testimonials-container">
          <motion.div 
            className="testimonials-header"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="heading-accent">
              <span className="accent-dot"></span>
            </div>
            <h2 id="testimonials-heading">What Do People Say About Us?</h2>
            <p className="testimonials-subtitle">
              Real experiences from our users who found clarity in their legal matters
            </p>
          </motion.div>

          <motion.div 
            className="testimonials-grid"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                className="testimonial-card"
                variants={cardVariants}
                role="article"
                tabIndex={0}
                onClick={() => setSelectedTestimonial(testimonial)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedTestimonial(testimonial);
                  }
                }}
                aria-label={`Testimonial from ${testimonial.name}, ${testimonial.role}`}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="card-glow"></div>
                <div className="card-content">
                  <div className="quote-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </div>
                  
                  <p className="testimonial-text">{testimonial.text}</p>
                  
                  <div className="testimonial-author">
                    <div className="author-avatar" aria-label={`${testimonial.name}'s avatar`}>
                      {testimonial.avatarUrl ? (
                        <img src={testimonial.avatarUrl} alt={testimonial.name} />
                      ) : (
                        <span className="avatar-initials">{getInitials(testimonial.name)}</span>
                      )}
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal for full testimonial */}
      {selectedTestimonial && (
        <motion.div 
          className="testimonial-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTestimonial(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div 
            className="testimonial-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={() => setSelectedTestimonial(null)}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className="modal-content">
              <div className="modal-quote-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>
              
              <p className="modal-text">{selectedTestimonial.text}</p>
              
              <div className="modal-author">
                <div className="author-avatar large">
                  {selectedTestimonial.avatarUrl ? (
                    <img src={selectedTestimonial.avatarUrl} alt={selectedTestimonial.name} />
                  ) : (
                    <span className="avatar-initials">{getInitials(selectedTestimonial.name)}</span>
                  )}
                </div>
                <div className="author-info">
                  <h3 id="modal-title" className="author-name">{selectedTestimonial.name}</h3>
                  <p className="author-role">{selectedTestimonial.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default TestimonialCards;
