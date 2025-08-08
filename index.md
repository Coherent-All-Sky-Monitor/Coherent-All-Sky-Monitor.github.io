---
layout: default
title: CASM
---

# Coherent All Sky Moniter

_FRBs?_
## About Us

FRBs

## Repository List

<table>
  <thead>
    <tr>
      <th>Repository</th>
      <th>Description</th>
      <th>Language</th>
      <th>Stars</th>
      <th>Pages</th>
      <th>Last Updated</th>
    </tr>
  </thead>
  <tbody>
    {% assign repos = site.data.repos %}
    {% for repo in repos %}
    <tr>
      <td><a href="{{ repo.html_url }}">{{ repo.name }}</a></td>
      <td>{{ repo.description }}</td>
      <td>{{ repo.language }}</td>
      <td>{{ repo.stars }}</td>
      <td>{% if repo.pages_url %}<a href="{{ repo.pages_url }}">Docs</a>{% endif %}</td>
      <td>{{ repo.updated_at | slice: 0, 10 }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

