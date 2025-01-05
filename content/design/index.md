---
title: Overview
description: Echo Design System Overview
---

<div class="design-layout">
<div class="design-sidebar">
<design-sidebar />
</div>

<div class="design-content">

<h1>Introduction</h1>
<p class="intro-text">Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque.</p>

<div class="hero-image">
<img src="/images/echo-pattern.svg" alt="Echo Pattern" />
</div>

<div class="content-grid">
  <div class="content-left">
    <h2>Something here about design</h2>
    <p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.</p>
  </div>
  
  <div class="content-right">
    <h3>Goal #1</h3>
    <p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.</p>

   <h3>Goal #2</h3>
    <p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.</p>

   <h3>Goal #3</h3>
    <p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.</p>

  </div>
</div>

<div class="card-grid">
<div class="card">
<div class="card-image">
<img src="/images/foundation.png" alt="Foundation" />
</div>
<h3>Foundation</h3>
<p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et.</p>
</div>

<div class="card">
<div class="card-image">
<img src="/images/digital.png" alt="Digital" />
</div>
<h3>Digital</h3>
<p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et.</p>
</div>

<div class="card">
<div class="card-image">
<img src="/images/product.png" alt="Product" />
</div>
<h3>Product</h3>
<p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et.</p>
</div>

<div class="card">
<div class="card-image">
<img src="/images/sound.png" alt="Sound" />
</div>
<h3>Sound</h3>
<p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et.</p>
</div>

<div class="card">
<div class="card-image">
<img src="/images/space.png" alt="Space" />
</div>
<h3>Space</h3>
<p>Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et.</p>
</div>
</div>

<div class="pagination">
<a href="/" class="prev">Home</a>
<a href="/design/foundation/introduction" class="next">Introduction</a>
</div>

</div>
</div>

<style>
:root {
  --echo-orange: #ff4d00;
  --echo-blue: #4b6bfb;
  --dark-bg: #1c1c1c;
}

.design-layout {
  display: grid;
  grid-template-columns: 228px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.design-sidebar {
  position: sticky;
  top: 0;
  height: fit-content;
}

.design-content {
  min-width: 0;
  padding: 0 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 64px;
  margin-bottom: 64px;
}

.content-left h2 {
  font-size: 48px;
  font-weight: 500;
  line-height: 1.1;
  margin: 0 0 24px;
  letter-spacing: -0.02em;
}

.content-left p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.content-right h3 {
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 16px;
}

.content-right p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0 0 32px;
}

.content-right p:last-child {
  margin-bottom: 0;
}

.hero-image {
  width: 100%;
  height: 300px;
  background: var(--dark-bg);
  border-radius: 1rem;
  margin: 2.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-image img {
  width: 200px;
  height: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 3rem 0;
}

.card {
  background: var(--dark-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
}

.card-image {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: white;
}

.card p {
  margin: 0;
  color: #999;
  font-size: 0.875rem;
  line-height: 1.5;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.pagination a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.pagination a:hover {
  color: var(--echo-orange);
}

.pagination .prev::before {
  content: "←";
  font-size: 1.25rem;
}

.pagination .next::after {
  content: "→";
  font-size: 1.25rem;
}

.design-content h1 {
  font-size: 48px;
  font-weight: 500;
  line-height: 1.1;
  margin: 48px 0 24px;
  letter-spacing: -0.02em;
}

.intro-text {
  font-size: 18px;
  line-height: 1.6;
  color: #666;
  margin: 0 0 48px;
  max-width: 720px;
}
</style>
