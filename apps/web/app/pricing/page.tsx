'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const plans = {
  monthly: [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for occasional sellers',
      features: [
        { included: true, text: 'Up to 3 active listings' },
        { included: true, text: '5 photos per listing' },
        { included: true, text: '30-day listing duration' },
        { included: true, text: 'Basic messaging' },
        { included: false, text: 'Featured listings' },
        { included: false, text: 'Listing boost' },
        { included: false, text: 'Dealer analytics' },
        { included: false, text: 'Team members' },
      ],
      cta: 'Get Started',
      ctaLink: '/post',
      popular: false,
    },
    {
      name: 'Standard',
      price: '3,000',
      description: 'Per listing, pay as you go',
      features: [
        { included: true, text: 'Unlimited listings' },
        { included: true, text: '30 photos per listing' },
        { included: true, text: '60-day listing duration' },
        { included: true, text: 'Priority messaging' },
        { included: true, text: 'Featured listing option' },
        { included: true, text: 'Listing boost' },
        { included: false, text: 'Dealer analytics' },
        { included: false, text: 'Team members' },
      ],
      cta: 'Post a Listing',
      ctaLink: '/post',
      popular: true,
    },
    {
      name: 'Dealer',
      price: '50,000',
      description: 'Per month, for professionals',
      features: [
        { included: true, text: 'Unlimited listings' },
        { included: true, text: '30 photos per listing' },
        { included: true, text: 'Permanent listings' },
        { included: true, text: 'Priority messaging' },
        { included: true, text: 'Auto-featured listings' },
        { included: true, text: 'Monthly listing boost' },
        { included: true, text: 'Full dealer analytics' },
        { included: true, text: 'Up to 3 team members' },
      ],
      cta: 'Contact Us',
      ctaLink: '/contact',
      popular: false,
    },
  ],
  annual: [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for occasional sellers',
      features: [
        { included: true, text: 'Up to 3 active listings' },
        { included: true, text: '5 photos per listing' },
        { included: true, text: '30-day listing duration' },
        { included: true, text: 'Basic messaging' },
        { included: false, text: 'Featured listings' },
        { included: false, text: 'Listing boost' },
        { included: false, text: 'Dealer analytics' },
        { included: false, text: 'Team members' },
      ],
      cta: 'Get Started',
      ctaLink: '/post',
      popular: false,
    },
    {
      name: 'Standard',
      price: '30,000',
      description: 'Per year — save 17%',
      features: [
        { included: true, text: 'Unlimited listings' },
        { included: true, text: '30 photos per listing' },
        { included: true, text: '60-day listing duration' },
        { included: true, text: 'Priority messaging' },
        { included: true, text: 'Featured listing option' },
        { included: true, text: 'Listing boost' },
        { included: false, text: 'Dealer analytics' },
        { included: false, text: 'Team members' },
      ],
      cta: 'Post a Listing',
      ctaLink: '/post',
      popular: true,
    },
    {
      name: 'Dealer',
      price: '500,000',
      description: 'Per year — save 17%',
      features: [
        { included: true, text: 'Unlimited listings' },
        { included: true, text: '30 photos per listing' },
        { included: true, text: 'Permanent listings' },
        { included: true, text: 'Priority messaging' },
        { included: true, text: 'Auto-featured listings' },
        { included: true, text: 'Monthly listing boost' },
        { included: true, text: 'Full dealer analytics' },
        { included: true, text: 'Up to 3 team members' },
      ],
      cta: 'Contact Us',
      ctaLink: '/contact',
      popular: false,
    },
  ],
};

const faqs = [
  { q: 'How long does a listing stay active?', a: 'Free listings are active for 30 days. Standard listings last 60 days. Dealer listings never expire.' },
  { q: 'Can I pay with MTN Mobile Money?', a: 'Yes! We accept MTN MoMo, Airtel Money, and bank transfers.' },
  { q: 'What happens when my listing expires?', a: 'You can renew it for free (if on Free plan) or it will be automatically renewed (Dealer plan).' },
  { q: 'How do I become a verified dealer?', a: 'Apply through your dashboard. We will review your business registration and approve within 48 hours.' },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlans = plans[billingCycle];

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 text-lg">Choose the plan that works for you</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
            <button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`w-14 h-7 rounded-full transition-colors relative ${billingCycle === 'annual' ? 'bg-gold' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual <span className="text-success font-medium">Save 17%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {currentPlans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-xl shadow-md overflow-hidden ${plan.popular ? 'ring-2 ring-gold relative' : ''}`}>
              {plan.popular && (
                <div className="bg-gold text-navy text-center text-sm font-medium py-1">Most Popular</div>
              )}
              <div className="p-8">
                <h3 className="font-display text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">RWF {plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-gray-500 text-sm">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  )}
                </div>
                <Link href={plan.ctaLink} className={`mt-6 block text-center py-3 rounded-md font-medium transition-colors ${
                  plan.popular ? 'btn-primary' : 'btn-secondary'
                }`}>
                  {plan.cta}
                </Link>
              </div>
              <div className="px-8 pb-8">
                <div className="border-t border-gray-100 pt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <Check size={16} className="text-success flex-shrink-0" />
                      ) : (
                        <X size={16} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-sm mb-4">Accepted payment methods</p>
          <div className="flex justify-center gap-4">
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">MTN MoMo</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">Airtel Money</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">Visa/MC</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
