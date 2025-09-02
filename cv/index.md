
---
layout: default
title: CV
permalink: /cv/
---
<div class="card">
  <h1>{{ site.data.profile.name }}</h1>
  <p class="small">{{ site.data.profile.tagline }}</p>
</div>

<div class="card">
  <h2>Publications (selected)</h2>
  <ol>
  {% assign pubs = site.publications | sort: 'date' | reverse %}
  {% for p in pubs limit:20 %}
    <li>{{ p.authors }}. "<strong>{{ p.title }}</strong>". {% if p.venue %}{{ p.venue }}.{% endif %} {% if p.year %}{{ p.year }}.{% endif %}
      {% if p.doi %}<a class="btn small" href="https://doi.org/{{ p.doi }}">DOI</a>{% endif %}
      {% if p.pdf %}<a class="btn small" href="{{ p.pdf }}">PDF</a>{% endif %}
      {% if p.url and p.url contains 'http' %}<a class="btn small" href="{{ p.url }}">Link</a>{% endif %}
    </li>
  {% endfor %}
  </ol>
</div>

<div class="card no-print">
  <button class="btn" onclick="window.print()">Print / Save as PDF</button>
</div>
