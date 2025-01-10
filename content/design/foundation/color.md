---
title: Color
description: Echo Design System
---

::raw

<script setup>
const primaryColors = ['white', 'orange', 'black']
const secondaryColors = ['blue', 'red']
const tertiaryColors = ['yellow', 'green', 'blue-light', 'red-dark', 'lime', 'cyan']

const shadeTypes = {
  primary: ['black-shades', 'orange-shades'],
  secondary: ['blue-shades', 'red-shades'],
  tertiary: [
    'blue-light-shades',
    'cyan-shades',
    'yellow-shades',
    'red-dark-shades',
    'green-shades',
    'lime-shades'
  ]
}
</script>

<template>
<div class="color-display"> <section class="color-section">
      <div class="color-heading">
        <h2>Primary color</h2>
        <p>Our primary colors form the foundation of our visual identity.</p>
      </div>
      <div class="color-grid primary-colors">
        <div v-for="color in primaryColors"
             :key="color"
             class="color-box"
             :class="color">
             <span class="color-name">{{ color }}</span>
        </div>
      </div>
    </section>

  <section class="color-section">
      <div class="color-heading">
        <h2>Secondary color</h2>
        <p>Secondary colors complement our primary palette and provide additional visual hierarchy.</p>
      </div>
      <div class="color-grid secondary-colors">
        <div v-for="color in secondaryColors"
             :key="color"
             class="color-box"
             :class="color">
             <span class="color-name">{{ color }}</span>
        </div>
      </div>
    </section>

  <section class="color-section">
      <div class="color-heading">
        <h2>Tertiary color</h2>
        <p>Our tertiary colors provide flexibility for various UI elements and states.</p>
      </div>
      <div class="color-grid tertiary-colors">
        <div v-for="color in tertiaryColors"
             :key="color"
             class="color-box"
             :class="color">
             <span class="color-name">{{ color }}</span>
        </div>
      </div>
    </section>

    <section class="shades-section">
      <h2>Primary color shades</h2>
      <div class="color-shades">
        <div v-for="type in shadeTypes.primary"
             :key="type"
             class="shade-row"
             :class="type">
          <div v-for="n in 8" :key="n" class="shade"></div>
        </div>
      </div>

      <h2>Secondary color shades</h2>
      <div class="color-shades">
        <div v-for="type in shadeTypes.secondary"
             :key="type"
             class="shade-row"
             :class="type">
          <div v-for="n in 8" :key="n" class="shade"></div>
        </div>
      </div>

      <h2>Tertiary color shades</h2>
      <div class="color-shades">
        <div v-for="type in shadeTypes.tertiary"
             :key="type"
             class="shade-row"
             :class="type">
          <div v-for="n in 8" :key="n" class="shade"></div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.color-display {
  margin: 2rem 0;
}

.color-section {
  margin-bottom: 3rem;
}

.color-heading {
  margin-bottom: 1.5rem;
}

.color-heading h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.color-grid {
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
  display: flex;
  align-items: flex-end;
  padding: 0.75rem;
  position: relative;
}

.color-name {
  color: white;
  font-size: 0.875rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.white { 
  background-color: #FFFFFF; 
  border: 1px solid #EEEEEE; 
}
.white .color-name {
  color: #333;
  text-shadow: none;
}

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
  margin: 1.5rem 0 3rem;
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

@media (max-width: 768px) {
  .primary-colors,
  .secondary-colors,
  .tertiary-colors {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

::

# Color

Our color system helps define the visual expression of our products. Each group of colors is carefully selected to
