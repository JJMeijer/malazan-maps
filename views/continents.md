---
layout: map.njk
date: Last Modified

pagination:
    data: continents
    size: 1
    alias: item
    addAllPagesToCollections: true

permalink: "continents/{{ item.name | slugify }}/"

eleventyComputed:
    title: "{{ item.name }}"
    description: "{{ item.description }}"

title: "{{ eleventyComputed.title }}"
description: "{{ eleventyComputed.description }}"
---
