"use client"

import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';

// components

import LpHeader from '@/app/components/landingpage-new/header/Header';
import C2a from '@/app/components/landingpage/c2a/C2a';

import Footer from '@/app/components/landingpage/footer/Footer';
import Testimonial from '@/app/components/landingpage/testimonial/Testimonial';
import Frameworks from '@/app/components/landingpage/frameworks/Frameworks';

import Banner from '@/app/components/landingpage-new/banner/Banner';
import DemoSlider from '@/app/components/landingpage-new/demo-slider/DemoSlider';
import Features from '@/app/components/landingpage-new/features/Features';
import TechnologyOffers from '@/app/components/landingpage-new/features/TechnologyOffers';
import C2a2 from '@/app/components/landingpage-new/c2a/C2a2';

export default function Landingpage() {
  return (
    <PageContainer title="Landingpage" description="this is Landingpage">
      <LpHeader />
      <Banner />
      <DemoSlider />
      <Frameworks />
      <Testimonial />
      <Features />
      <TechnologyOffers />
      <C2a />
      <C2a2 />
      <Footer />
    </PageContainer>
  );
};

Landingpage.layout = "Blank";
