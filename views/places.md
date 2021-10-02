---
layout: map.njk
date: Last Modified

pagination:
    data: places
    size: 1
    alias: item
    addAllPagesToCollections: true

permalink: "places/{{ item.name | slugify }}/"

eleventyComputed:
    title: "{{ item.name }}"
    description: "{{ item.description }}"

title: "{{ eleventyComputed.title }}"
description: "{{ eleventyComputed.description }}"
---
