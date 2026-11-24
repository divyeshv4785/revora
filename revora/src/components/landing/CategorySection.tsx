'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CATEGORIES } from '@/data/mockData';
import { Category } from '@/types';

interface CategorySectionProps {
  onSelectCategory: (category: Category) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 bg-revora-mainBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Body Styles & Class"
          title="Explore Cars by Category"
          description="Whether you're seeking a fuel-efficient city hatchback, a commanding SUV, or an executive sedan, discover curated options tailored to Indian driving conditions."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-revora-border shadow-card hover:shadow-cardHover transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Consistent Ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src={cat.image}
                  alt={`${cat.name} Category`}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Available Count Pill */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-revora-textPrimary backdrop-blur-md shadow-sm">
                    {cat.count}
                  </span>
                </div>

                {/* Category Title on image overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-revora-sky transition-colors">
                      {cat.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-revora-sky group-hover:text-revora-dark text-white flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <p className="text-xs text-revora-textSecondary leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-medium text-revora-steel truncate">
                    Popular: {cat.popularModels}
                  </span>
                  <span className="font-semibold text-revora-steel shrink-0 group-hover:underline ml-2">
                    Browse →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
