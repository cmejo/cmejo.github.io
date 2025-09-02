
---
layout: default
title: Home
---
<header class="hero">
  <img src="{{ '/assets/profile.jpg' | relative_url }}" alt="Portrait" width="160" height="160">
  <div>
    <h1>Christopher Mejo, Ph.D.</h1>
    <p class="small">AI Researcher & Theoretical Computer Scientist</p>
    <p class="prose">{{ site.data.profile.summary }}</p>
    <p><a class="btn" href="{{ '/cv/' | relative_url }}">CV (print/PDF)</a></p>
  </div>
</header>
