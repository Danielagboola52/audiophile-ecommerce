import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
}

export default function CategoryCard({ title, image, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="bg-secondary-grey rounded-lg p-6 pt-20 pb-6 text-center relative group hover:scale-105 transition-transform duration-300"
    >
      {/* Product Image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
        />
      </div>

      {/* Title */}
      <h3 className="text-h6 uppercase mb-4 mt-16">{title}</h3>

      {/* Shop Link */}
      <div className="flex items-center justify-center gap-3 text-subtitle text-black/50 group-hover:text-primary-orange transition-colors">
        <span>SHOP</span>
        <svg width="8" height="12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.322 1l5 5-5 5" stroke="#D87D4A" strokeWidth="2" fill="none" fillRule="evenodd"/>
        </svg>
      </div>
    </Link>
  );
}