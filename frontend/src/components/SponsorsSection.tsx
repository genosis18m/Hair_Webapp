import React from 'react';

const SponsorsSection: React.FC = () => {
  // Made-up hair care companies with their "logos" as text/initials
  const sponsors = [
    { name: 'HairLux', initials: 'HL', color: 'from-purple-500 to-pink-500' },
    { name: 'VitalStrands', initials: 'VS', color: 'from-green-500 to-emerald-500' },
    { name: 'SilkRoot', initials: 'SR', color: 'from-orange-500 to-red-500' },
    { name: 'ManeGlow', initials: 'MG', color: 'from-blue-500 to-cyan-500' },
    { name: 'PureFollicle', initials: 'PF', color: 'from-yellow-500 to-orange-500' },
  ];

  const reviewers = [
    { name: '@HairCareMaven', subscribers: '2.1M' },
    { name: '@StrandScience', subscribers: '890K' },
    { name: '@BeautyByDrP', subscribers: '1.5M' },
    { name: '@NaturalHairJourney', subscribers: '650K' },
  ];

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* YouTube Reviewers */}
        <div className="text-center mb-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-4">
            Trusted by Top Hair Care Reviewers on YouTube
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {reviewers.map((reviewer) => (
              <div key={reviewer.name} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">{reviewer.name}</span>
                  <span className="text-gray-400 text-xs ml-1">({reviewer.subscribers})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          {/* Hair Care Company Sponsors */}
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-8">
            Sponsored by Leading Hair Care Brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center gap-3 group cursor-pointer">
                {/* Logo circle with gradient */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sponsor.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-lg">{sponsor.initials}</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
