---
title: Logo
description: Echo Design System logo documen
---

<div class="design-layout">
<div class="design-content">

# Logo

The Echo logo embodies our commitment to innovation and clarity in design. It serves as the cornerstone of our brand identity.

<div class="logo-section">
  <div class="section-heading">
    <h2>Construction</h2>
  </div>
  <div class="section-content">
    <div class="logo-construction">
      <img src="/images/logo-construction.svg" alt="Logo construction grid showing measurements and proportions" />
    </div>
    <div class="description">
      <h3>We call our symbol The Zig</h3>
      <ul>
        <li><strong>The Zig</strong>: Our signature element represents forward momentum and energy</li>
        <li><strong>Grid System</strong>: Built on a mathematical grid for perfect proportions</li>
        <li><strong>Angles</strong>: Consistent 45-degree angles maintain visual harmony</li>
      </ul>
    </div>
  </div>
</div>

<div class="logo-section">
  <div class="section-heading">
    <h2>Zig - Monogram</h2>
  </div>
  <div class="section-content">
    <div class="logo-showcase monogram">
      <img src="/images/zig-monogram.svg" alt="Zig monogram symbol in black" />
    </div>
    <div class="description">
      <p>The Zig monogram serves as our icon mark, designed for recognition at smaller scales and as a memorable brand element.</p>
      <ul>
        <li>App icons</li>
        <li>Favicons</li>
        <li>Social media avatars</li>
        <li>Small-scale applications</li>
      </ul>
    </div>
  </div>
</div>

<div class="logo-section">
  <div class="section-heading">
    <h2>Zig - Clearspaces</h2>
  </div>
  <div class="section-content">
    <div class="logo-showcase clearspaces">
      <img src="/images/zig-clearspaces.svg" alt="Zig logo with clearspace guidelines showing minimum spacing requirements" />
    </div>
    <div class="description">
      <ul>
        <li><strong>Minimum Clearspace</strong>: Equal to the height of the Zig monogram</li>
        <li><strong>Protected Area</strong>: No other visual elements may intrude into this space</li>
        <li><strong>Scaling</strong>: Clearspace scales proportionally with logo size</li>
      </ul>
    </div>
  </div>
</div>

<div class="logo-section">
  <div class="section-heading">
    <h2>Zig - Alignment</h2>
  </div>
  <div class="section-content">
    <div class="logo-showcase alignment">
      <img src="/images/zig-alignment.svg" alt="Zig logo alignment guidelines showing proper positioning" />
    </div>
    <div class="description">
      <h3>Horizontal Alignment</h3>
      <ul>
        <li>Left-aligned with content when possible</li>
        <li>Centered for standalone applications</li>
      </ul>
      <h3>Vertical Alignment</h3>
      <ul>
        <li>Baseline alignment with adjacent text</li>
        <li>Optical center alignment in contained spaces</li>
      </ul>
    </div>
  </div>
</div>

<div class="logo-section">
  <div class="section-heading">
    <h2>Zig - Small Reproduction</h2>
  </div>
  <div class="section-content">
    <div class="logo-showcase reproduction">
      <div class="reproduction-grid">
        <div class="logo-dark">
          <img src="/images/zig-small-dark.svg" alt="Zig logo small reproduction on dark background" />
        </div>
        <div class="logo-light">
          <img src="/images/zig-small-light.svg" alt="Zig logo small reproduction on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="logo-section">
  <div class="section-heading">
    <h2>Logo Variations</h2>
  </div>
  <div class="section-content">
    <ul>
      <li><strong>Primary Logo</strong>: Full-color version for primary applications. Used on white or light backgrounds.</li>
      <li><strong>Monochrome</strong>: Black version for dark backgrounds. White version for light backgrounds.</li>
      <li><strong>One-Color</strong>: Solid brand orange version. Used for special applications.</li>
    </ul>
  </div>
</div>

<div class="logo-section">
  <div class="section-heading">
    <h2>Usage Guidelines</h2>
  </div>
  <div class="section-content">
    <h3>Do's</h3>
    <ul>
      <li>Maintain minimum size requirements</li>
      <li>Use approved color variations</li>
      <li>Preserve clearspace</li>
      <li>Scale proportionally</li>
    </ul>
    <h3>Don'ts</h3>
    <ul>
      <li>Don't modify the logo design</li>
      <li>Don't rotate or skew</li>
      <li>Don't change colors</li>
      <li>Don't add effects or shadows</li>
    </ul>
  </div>
</div>

</div>
</div>

<style>
.design-layout {
  display: flex;
  gap: 2rem;
}

.design-content {
  flex: 1;
  max-width: 800px;
}

.logo-section {
  display: flex;
  gap: 2rem;
  margin: 3rem 0;
}

.section-heading {
  flex: 1;
}

.section-heading h2 {
  margin: 0;
}

.section-content {
  flex: 2;
}

.logo-construction,
.logo-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.logo-construction img,
.logo-showcase img {
  width: 100%;
  height: auto;
  display: block;
}

.description {
  margin-top: 2rem;
}

.description h3 {
  margin: 0 0 1rem;
}

.description p {
  color: #666;
  margin: 0 0 1rem;
}

.reproduction-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.logo-dark {
  background: #000;
  padding: 2rem;
  border-radius: 4px;
}

.logo-light {
  background: #fff;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }
  
  .logo-section {
    flex-direction: column;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .reproduction-grid {
    grid-template-columns: 1fr;
  }
}
</style>
