import React from 'react';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/home/CategoryCard';

export default function Home() {
  return (
    <div>
      {/* Hero Section - Simple version without background image for now */}
      <section className="bg-secondary-black text-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="py-24 lg:py-32 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <p className="text-overline text-white/50 uppercase mb-6">New Product</p>
            <h1 className="text-h1 uppercase mb-6">
              XX99 Mark II <br /> Headphones
            </h1>
            <p className="text-body text-white/75 mb-10">
              Experience natural, lifelike audio and exceptional build quality made for the
              passionate music enthusiast.
            </p>
            <Button variant="primary" href="/product/xx99-mark-two-headphones">
              See Product
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section - Text only for now */}
      <section className="container mx-auto px-6 lg:px-20 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-secondary-grey rounded-lg p-12 text-center hover:scale-105 transition-transform">
            <h3 className="text-h6 uppercase mb-4 mt-16">Headphones</h3>
            <Button variant="quaternary" href="/headphones">
              SHOP →
            </Button>
          </div>
          <div className="bg-secondary-grey rounded-lg p-12 text-center hover:scale-105 transition-transform">
            <h3 className="text-h6 uppercase mb-4 mt-16">Speakers</h3>
            <Button variant="quaternary" href="/speakers">
              SHOP →
            </Button>
          </div>
          <div className="bg-secondary-grey rounded-lg p-12 text-center hover:scale-105 transition-transform">
            <h3 className="text-h6 uppercase mb-4 mt-16">Earphones</h3>
            <Button variant="quaternary" href="/earphones">
              SHOP →
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Product: ZX9 Speaker */}
      <section className="container mx-auto px-6 lg:px-20 mb-12">
        <div className="bg-primary-orange rounded-lg p-12 lg:p-24 text-center text-white">
          <h2 className="text-h2 uppercase mb-6">
            ZX9 <br /> Speaker
          </h2>
          <p className="text-body text-white/75 mb-10 max-w-sm mx-auto">
            Upgrade to premium speakers that are phenomenally built to deliver truly
            remarkable sound.
          </p>
          <Button variant="secondary" href="/product/zx9-speaker">
            See Product
          </Button>
        </div>
      </section>

      {/* Featured Product: ZX7 Speaker */}
      <section className="container mx-auto px-6 lg:px-20 mb-12">
        <div className="bg-secondary-grey rounded-lg p-12 lg:p-24">
          <h2 className="text-h4 uppercase mb-8">ZX7 Speaker</h2>
          <Button variant="tertiary" href="/product/zx7-speaker">
            See Product
          </Button>
        </div>
      </section>

      {/* Featured Product: YX1 Earphones */}
      <section className="container mx-auto px-6 lg:px-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary-grey rounded-lg h-80 flex items-center justify-center">
            <p className="text-h6">YX1 Image</p>
          </div>
          <div className="bg-secondary-grey rounded-lg p-12 flex flex-col justify-center">
            <h2 className="text-h4 uppercase mb-8">YX1 Earphones</h2>
            <Button variant="tertiary" href="/product/yx1-earphones">
              See Product
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 lg:px-20 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-secondary-grey rounded-lg h-80 lg:h-96 flex items-center justify-center lg:order-2">
            <p className="text-h6">Best Gear Image</p>
          </div>
          <div className="lg:order-1 text-center lg:text-left">
            <h2 className="text-h2 uppercase mb-8">
              Bringing you the <span className="text-primary-orange">best</span> audio gear
            </h2>
            <p className="text-body text-black/50">
              Located at the heart of New York City, Audiophile is the premier store for high
              end headphones, earphones, speakers, and audio accessories. We have a large
              showroom and luxury demonstration rooms available for you to browse and
              experience a wide range of our products. Stop by our store to meet some of the
              fantastic people who make Audiophile the best place to buy your portable audio
              equipment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}