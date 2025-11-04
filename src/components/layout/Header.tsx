'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'HEADPHONES', href: '/headphones' },
    { name: 'SPEAKERS', href: '/speakers' },
    { name: 'EARPHONES', href: '/earphones' },
  ];

  return (
    <header className="bg-secondary-black border-b border-white/10">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between py-8">
          {/* Hamburger Menu (Mobile) */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg">
              <g fill="#FFF" fillRule="evenodd">
                <path d="M0 0h16v3H0zM0 6h16v3H0zM0 12h16v3H0z"/>
              </g>
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="lg:mr-auto">
            <Image
              src="/assets/logo.svg"
              alt="audiophile"
              width={143}
              height={25}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-subtitle text-white hover:text-primary-orange transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative"
            aria-label="Open cart"
          >
            <Image
              src="/assets/carts.svg"
              alt="Cart"
              width={23}
              height={20}
              className="cursor-pointer"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white absolute top-[90px] left-0 right-0 z-50 shadow-lg">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-subtitle text-secondary-black hover:text-primary-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}