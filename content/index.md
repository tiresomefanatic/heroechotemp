---
title: ECHO Design System
description: Foundation of Design
---

<script setup>
const CardComponent = {
  props: {
    image: String,
    alt: String,
    title: String,
    description: String
  },
  template: `
    <div class="card">
      <div class="card-image">
        <img :src="image" :alt="alt"/>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `
}

const GoalItem = {
  props: {
    title: String,
    description: String
  },
  template: `
    <div class="goal-item">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `
}

const FooterItem = {
  props: {
    title: String,
    description: String,
    link: String,
    linkText: String
  },
  template: `
    <div class="footer-item">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <a :href="link" class="arrow-link">{{ linkText }}</a>
    </div>
  `
}

const cards = [
  {
    image: '/images/design-circles.svg',
    alt: 'Design circular pattern',
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet consectetur ut et amet. Ullamcorper ut et ullamcorper consectur ut et amet.'
  },
  {
    image: '/images/develop-curves.svg',
    alt: 'Develop curve pattern',
    title: 'Develop',
    description: 'Lorem ipsum dolor sit amet consectetur ut et amet. Ullamcorper ut et ullamcorper consectur ut et amet.'
  },
  {
    image: '/images/contribute-waves.svg',
    alt: 'Contribute wave pattern',
    title: 'Contribute',
    description: 'Lorem ipsum dolor sit amet consectetur ut et amet. Ullamcorper ut et ullamcorper consectur ut et amet.'
  }
]

const goals = [
  {
    title: 'Cohesive Experience',
    description: 'Create a cohesive experience across all digital brand and product functions'
  },
  {
    title: 'Autonomy',
    description: 'Give autonomy to anyone working or working on our digital products'
  },
  {
    title: 'Feedback and contribution',
    description: 'Collect feedback and offer design reviews to help improve digital product creation process'
  }
]

const footerItems = [
  {
    title: "What's new?",
    description: 'Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut.',
    link: '#',
    linkText: 'View updates →'
  },
  {
    title: 'Get in touch',
    description: 'Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut.',
    link: '#',
    linkText: 'Contact us →'
  }
]
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h1>FOUNDATION<br/>OF DESIGN</h1>
      </div>
    </section>

   <div class="container">
      <section class="get-started">
        <h2>Get started</h2>

   <div class="card-grid">
          <CardComponent
            v-for="card in cards"
            :key="card.title"
            :image="card.image"
            :title="card.title"
            :description="card.description"
            :alt="card.alt"
          />
        </div>
      </section>

   <section class="echosystem">
        <h2>What's the Echosystem?</h2>
        <p class="description">Echo is a Design System we use to create Meta products. Our main goal is to offer everything you need — design specs, code files, and guidelines. Access distributed to the people that need them and always available in the spaces that we work in.</p>

   <div class="dark-box">
          <img src="/images/echosystem-grid.svg" alt="Echosystem illustration"/>
        </div>
      </section>

  <section class="goals">
        <h2>Goals</h2>

  <div class="goals-list">
          <GoalItem
            v-for="goal in goals"
            :key="goal.title"
            :title="goal.title"
            :description="goal.description"
          />
        </div>
      </section>

   <section class="origin">
        <h2>How did ECHO come about?</h2>

  <div class="blue-card">
          <h3>Echoing from the past.<br/>Echoing into the future.</h3>
        </div>

   <div class="experience">
          <h3>Echo Experience</h3>
          <p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut vestibulum pharetra. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.</p>
        </div>
   </section>

   <div class="footer-grid">
        <FooterItem
          v-for="item in footerItems"
          :key="item.title"
          :title="item.title"
          :description="item.description"
          :link="item.link"
          :linkText="item.linkText"
        />
      </div>
    </div>

  </div>
</template>

<style>
.hero {
  margin: -64px calc(-50vw + 50%) 0;
  width: 100vw;
  height: 400px;
  background-color: #FF6B00;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 120px 80px;
}

.hero h1 {
  color: white;
  font-size: 48px;
  font-weight: 500;
  line-height: 1.2;
  margin: 0;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}

.get-started {
  margin-top: 80px;
}

h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 40px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-image {
  background: #1C1C1C;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: auto;
}

.card h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.card p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.echosystem {
  margin-top: 120px;
}

.echosystem .description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  max-width: 800px;
  margin-bottom: 40px;
}

.dark-box {
  background: #1C1C1C;
  border-radius: 12px;
  padding: 40px;
  margin-top: 40px;
}

.dark-box img {
  width: 100%;
  height: auto;
}

.goals {
  margin-top: 120px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.goal-item h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.goal-item p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.origin {
  margin-top: 120px;
}

.blue-card {
  background: #4361EE;
  border-radius: 12px;
  padding: 80px;
  text-align: center;
  margin: 40px 0;
}

.blue-card h3 {
  color: white;
  font-size: 32px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.experience {
  margin-top: 60px;
}

.experience h3 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
}

.experience p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  max-width: 800px;
  margin: 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px;
  margin: 120px 0;
}

.footer-item h2 {
  margin-bottom: 16px;
}

.footer-item p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 16px;
}

.arrow-link {
  color: #4361EE;
  text-decoration: none;
  font-size: 14px;
}

.arrow-link:hover {
  text-decoration: underline;
}
</style>
