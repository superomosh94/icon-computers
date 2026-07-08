import { useState } from 'react';
import { ChevronDownIcon } from '../components/ui/Icons';
import './FaqPage.css';

const faqs = [
  {
    id: 1,
    question: 'What payment methods do you accept?',
    answer:
      'We accept M-Pesa, bank transfer, and cash on pickup. For corporate clients, we can arrange invoice-based payments with approved purchase orders.',
  },
  {
    id: 2,
    question: 'Do you offer warranty on laptops?',
    answer:
      'Yes, every laptop we sell comes with a minimum 6-month warranty covering hardware defects. You can bring it to our shop on Moi Avenue and we will take care of it. Extended warranty plans of 12 or 24 months are available at an additional cost.',
  },
  {
    id: 3,
    question: 'Can I test the laptop before buying?',
    answer:
      'Absolutely. You are welcome to visit our showroom to inspect and test any laptop in person. Our team will set it up for you so you can check the keyboard, screen, ports, and overall condition before making a decision.',
  },
  {
    id: 4,
    question: 'How long does delivery take?',
    answer:
      'We are located in Nairobi. You can pick up in person at our Moi Avenue shop or arrange for delivery via our courier partner. Delivery within Nairobi typically takes 24 to 48 hours. For deliveries outside Nairobi, expect 2 to 5 business days depending on your location.',
  },
  {
    id: 5,
    question: 'What is your return policy?',
    answer:
      'You may return a laptop within 7 days of delivery if it has a defect that was not disclosed. The laptop must be returned in the same condition it was received, with all accessories and packaging. Return shipping is covered by us for verified defects.',
  },
  {
    id: 6,
    question: 'Are the laptops brand new or used?',
    answer:
      'We sell both brand new and professionally refurbished laptops. Every refurbished unit undergoes a thorough inspection, cleaning, and testing process. The condition grade is clearly listed on each product page so you know exactly what you are getting.',
  },
  {
    id: 7,
    question: 'How do I reserve a laptop?',
    answer:
      'You can reserve a laptop by visiting our showroom, calling us, or using the Reserve button on any product page. A deposit of 10% of the price secures your unit for up to 48 hours. The deposit goes toward the final purchase price.',
  },
];

export default function FaqPage() {
  const [openIds, setOpenIds] = useState([]);

  const toggleFaq = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="container">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find answers to common questions about our laptops, payments, delivery, and more.
          </p>
        </div>
      </section>

      <section className="faq-section section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <div key={faq.id} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className={`faq-chevron${isOpen ? ' faq-chevron--open' : ''}`}>
                      <ChevronDownIcon size={20} />
                    </span>
                  </button>
                  <div
                    className={`faq-answer${isOpen ? ' faq-answer--open' : ''}`}
                  >
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
