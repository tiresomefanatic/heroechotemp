---
title: Foundation of Design
description: Echo Design System documentation
---

<div class="hero">
  <h1>FOUNDATION<br/>OF DESIGN</h1>
</div>

## Get started

<div class="card-grid">
  <a href="/design" class="card design">
    <img src="/images/design-icon.svg" alt="Design icon" />
    <h3>Design</h3>
    <p>Create beautiful and intuitive interfaces that delight users and enhance their experience with our digital products.</p>
  </a>
  <a href="/develop" class="card develop">
    <img src="/images/develop-icon.svg" alt="Develop icon" />
    <h3>Develop</h3>
    <p>Build robust and scalable solutions using modern technologies and best practices in software development.</p>
  </a>
  <a href="/contribute" class="card contribute">
    <img src="/images/contribute-icon.svg" alt="Contribute icon" />
    <h3>Contribute</h3>
    <p>Join our community of creators and innovators to shape the future of digital experiences together.</p>
  </a>
</div>

## What is the Echosystem?

Echo is the Design System we use to create Web products. Our main goal is to offer everything in one place — assets, resources, files and guidelines. Always accessible to the people that need them and always available in the spaces that we work in.

<div class="echo-banner">
  <div class="banner-content">
    <h2>Echoing from the past.<br/>Echoing into the future.</h2>
  </div>
</div>

## Goals

<div class="goals">
  <div class="goal">
    <h3>Cohesive Experience</h3>
    <p>Create a cohesive experience across all digital, brand and product touchpoints</p>
  </div>
  <div class="goal">
    <h3>Autonomy</h3>
    <p>Give autonomy to all teams creating or working on our digital products</p>
  </div>
  <div class="goal">
    <h3>Feedback and contribution</h3>
    <p>Collect feedback and offer design toolkits to help improve the digital product creation process</p>
  </div>
</div>

## How did ECHO come about?

### Echo Experience

Lorem ipsum dolor sit amet consectetur. Et ut rhoncus dolor vestibulum pharetra et. A vitae pharetra nullam dolor vestibulum pharetra et. Pretium consequat venenatis augue quam nibh laoreet tempus tempor mi. Laoreet et proin diam adipiscing laboris.

<div class="footer-links">
  <div class="link-section">
    <h4>What's next?</h4>
    <p>Learn more about our design system and contribute to our ecosystem.</p>
    <a href="/design" class="link">View options →</a>
  </div>
  <div class="link-section">
    <h4>Get in touch</h4>
    <p>Questions or feedback? We'd love to hear from you.</p>
    <a href="/contact" class="link">Contact us →</a>
  </div>
</div>

<style>
:root {
  --echo-orange: #ff4d00;
  --echo-blue: #4b6bfb;
}

.hero {
  background-color: var(--echo-orange);
  padding: 4rem 2rem;
  margin: -2rem -2rem 2rem -2rem;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin: 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.card {
  padding: 2rem;
  border-radius: 8px;
  background: #f5f5f5;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.card img {
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
}

.echo-banner {
  background: var(--echo-blue);
  color: white;
  padding: 4rem 2rem;
  margin: 3rem -2rem;
  text-align: center;
}

.echo-banner h2 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 0;
}

.goals {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.goal {
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.link {
  color: var(--echo-orange);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .card-grid, .goals {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
  }
}
</style>
