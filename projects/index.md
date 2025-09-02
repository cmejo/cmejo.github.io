
---
layout: default
title: Projects
---
<h1>Projects</h1>
<ul>
{% assign projs = site.projects | sort: 'date' | reverse %}
{% for p in projs %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> {% if p.summary %}<span class="small">— {{ p.summary }}</span>{% endif %}</li>
{% endfor %}
</ul>
