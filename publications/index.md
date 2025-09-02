
---
layout: default
title: Publications
---
<h1>Publications</h1>
<ul>
{% assign pubs = site.publications | sort: 'date' | reverse %}
{% for p in pubs %}
  <li>
    {{ p.authors }}. "<strong>{{ p.title }}</strong>". {% if p.venue %}{{ p.venue }}, {% endif %}{% if p.year %}{{ p.year }}.{% endif %}
    {% if p.doi %}<a class="btn small" href="https://doi.org/{{ p.doi }}">DOI</a>{% endif %}
    {% if p.pdf %}<a class="btn small" href="{{ p.pdf }}">PDF</a>{% endif %}
    {% if p.url and p.url contains 'http' %}<a class="btn small" href="{{ p.url }}">Link</a>{% endif %}
  </li>
{% endfor %}
</ul>
