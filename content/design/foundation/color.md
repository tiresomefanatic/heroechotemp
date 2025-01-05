---
title: Color
description: Echo Design System color documentation
---

<style>
.design-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 4rem);
}

.design-content {
  padding: 2rem;
}

.color-section {
  margin-top: 2rem;
}

.color-heading {
  margin-bottom: 1rem;
}

.design-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.color-grid {
  flex: 2;
  display: grid;
  gap: 1rem;
}

.primary-colors {
  grid-template-columns: repeat(3, 1fr);
}

.secondary-colors {
  grid-template-columns: repeat(2, 1fr);
}

.tertiary-colors {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.color-box {
  aspect-ratio: 1;
  border-radius: 4px;
}

.white { background-color: #FFFFFF; border: 1px solid #EEEEEE; }
.orange { background-color: #FF4D00; }
.black { background-color: #000000; }
.blue { background-color: #4B6BFB; }
.red { background-color: #FF0000; }
.yellow { background-color: #FFB800; }
.green { background-color: #00C853; }
.blue-light { background-color: #4B6BFB; }
.red-dark { background-color: #D32F2F; }
.lime { background-color: #C6FF00; }
.cyan { background-color: #00BCD4; }

.color-shades {
  margin: 2rem 0;
}

.shade-row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.shade {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 2px;
}

.black-shades .shade:nth-child(1) { background-color: #000000; }
.black-shades .shade:nth-child(2) { background-color: #1A1A1A; }
.black-shades .shade:nth-child(3) { background-color: #333333; }
.black-shades .shade:nth-child(4) { background-color: #4D4D4D; }
.black-shades .shade:nth-child(5) { background-color: #666666; }
.black-shades .shade:nth-child(6) { background-color: #808080; }
.black-shades .shade:nth-child(7) { background-color: #999999; }
.black-shades .shade:nth-child(8) { background-color: #B3B3B3; }

.orange-shades .shade:nth-child(1) { background-color: #FF4D00; }
.orange-shades .shade:nth-child(2) { background-color: #FF6B1A; }
.orange-shades .shade:nth-child(3) { background-color: #FF8533; }
.orange-shades .shade:nth-child(4) { background-color: #FF9F4D; }
.orange-shades .shade:nth-child(5) { background-color: #FFB866; }
.orange-shades .shade:nth-child(6) { background-color: #FFD180; }
.orange-shades .shade:nth-child(7) { background-color: #FFE0B3; }
.orange-shades .shade:nth-child(8) { background-color: #FFF0E6; }

.accessibility-chart {
  margin: 2rem 0;
  border: 1px solid #EEEEEE;
  border-radius: 4px;
  padding: 1rem;
}

.accessibility-chart img {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .design-layout {
    grid-template-columns: 1fr;
  }
  
  .design-sidebar {
    width: 100%;
  }

  .color-section {
    margin-top: 1rem;
  }
}
</style>

<div class="design-layout">
<div class="design-content">

# Color

Our color system helps define the visual expression of our products. Each group of colors is carefully selected to ensure our designs are accessible and visually appealing.

<div class="color-section">
  <div class="color-heading">
    <h2>Primary color</h2>
    <p>Our primary colors form the foundation of our visual identity.</p>
  </div>
  <div class="color-grid primary-colors">
    <div class="color-box white"></div>
    <div class="color-box orange"></div>
    <div class="color-box black"></div>
  </div>
</div>

<div class="color-section">
  <div class="color-heading">
    <h2>Secondary color</h2>
    <p>Secondary colors complement our primary palette and provide additional visual hierarchy.</p>
  </div>
  <div class="color-grid secondary-colors">
    <div class="color-box blue"></div>
    <div class="color-box red"></div>
  </div>
</div>

<div class="color-section">
  <div class="color-heading">
    <h2>Tertiary color</h2>
    <p>Our tertiary colors provide flexibility for various UI elements and states.</p>
  </div>
  <div class="color-grid tertiary-colors">
    <div class="color-box yellow"></div>
    <div class="color-box green"></div>
    <div class="color-box blue-light"></div>
    <div class="color-box red-dark"></div>
    <div class="color-box lime"></div>
    <div class="color-box cyan"></div>
  </div>
</div>

<h2>Primary color shades</h2>
<div class="color-shades">
  <div class="shade-row black-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row orange-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
</div>

<h2>Secondary color shades</h2>
<div class="color-shades">
  <div class="shade-row blue-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row red-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
</div>

<h2>Tertiary color shades</h2>
<div class="color-shades">
  <div class="shade-row blue-light-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row cyan-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row yellow-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row red-dark-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row green-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
  <div class="shade-row lime-shades">
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
    <div class="shade"></div>
  </div>
</div>

<h2>Color accessibility chart</h2>
<p>The color combinations are designed to meet WCAG 2.0 accessibility standards. The chart below shows the contrast ratio between text and background colors:</p>

<ul>
  <li>AA Large: Text is at least 18pt or 14pt bold</li>
  <li>AA: Text is less than 18pt</li>
  <li>AAA: Enhanced contrast for text less than 18pt</li>
  <li>AAA Large: Enhanced contrast for text at least 18pt or 14pt bold</li>
</ul>

<div class="accessibility-chart">
  <img src="/images/color-accessibility-chart.svg" alt="Color accessibility chart showing contrast ratios between different color combinations" />
</div>

</div>
</div>
