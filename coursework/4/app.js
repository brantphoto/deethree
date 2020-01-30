'use strict'
// Data preparation.
function filterData(data) {
  return data.filter(d => {
    return (
      d.release_year > 1999 &&
      d.release_year < 2010 &&
      d.revenue > 0 &&
      d.budget > 0 &&
      d.genre &&
      d.title
    );
  });
}

function prepareBarChartData(data) {
  const dataMap = d3.rollup(
    data,
    v => d3.sum(v, leaf => leaf.revenue),
    d => d.genre
  );

  const dataArray = Array.from(dataMap, d => ({ genre: d[0], revenue: d[1] }));

  return dataArray;
}


// Data utilities.
const parseNA = string => (string === 'NA' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);

// Type conversion.
function normalize(d) {
  const date = parseDate(d.release_date);
  return {
    budget: +d.budget,
    genre: parseNA(d.genre),
    genres: JSON.parse(d.genres).map(d => d.name),
    homepage: parseNA(d.homepage),
    id: +d.id,
    imdb_id: parseNA(d.imdb_id),
    original_language: parseNA(d.original_language),
    overview: parseNA(d.overview),
    popularity: +d.popularity,
    poster_path: parseNA(d.poster_path),
    production_countries: JSON.parse(d.production_countries),
    release_date: date,
    release_year: date.getFullYear(),
    revenue: +d.revenue,
    runtime: +d.runtime,
    tagline: parseNA(d.tagline),
    title: parseNA(d.title),
    vote_average: +d.vote_average,
    vote_count: +d.vote_count,
  };
}

// Main function.
function main(movies) {
    const moviesClean = filterData(movies);
    const barChartData = prepareBarChartData(moviesClean)
        .sort((a, b) => d3.descending(a.revenue, b.revenue))

    // CHART MARGINS
    const margin = {top: 80, right: 40, bottom: 40, left: 80}
    const width = 400 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // COMMON GETTERS

    const xPropGetter = d => d.revenue
    const yPropGetter = d => d.genre

    const xScale = d3.scaleLinear([0, d3.max(barChartData, xPropGetter)], [0, width])
    const yScale = d3.scaleBand(barChartData.map(yPropGetter), [0, height])
        .round(true)
        .padding(.25)


  // DRAW BASE SVG
    const svg = d3.select('.bar-chart-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // DRAW HEADER CONTAINER
    const header = svg
        .append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(0, ${-margin.top / 2})`)
        .append('text')

  // DRAW HEADER 1
     header
     .append('tspan')
     .text('Total Revenue by Genre in $US')

  // DRAW HEADER 2
     header
     .append('tspan')
     .text('Films w/ budget and revenue figures, 2000-2009')
     .attr('x', 0)
     .attr('dy', '1.5em')
     .style('font-size', '0.8em')
     .style('fill', '#555')

  // DRAW BARS
  const bars = svg
    .selectAll('.bar')
    .data(barChartData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', d => yScale(yPropGetter(d)))
    .attr('width', d => xScale(xPropGetter(d)))
    .attr('height', d => yScale.bandwidth())
    .style('fill', 'dodgerblue')

    // configure x axis
    const xAxis = d3
        .axisTop(xScale)
        .tickFormat(d3.format('~s'))
        .tickSizeInner(-height)
        .tickSizeOuter(0)

    // DRAW X AXIS
    const xAxisDraw = svg
        .append('g')
        .attr('class', 'x axis')
        .call(xAxis)

    const yAxis = d3
        .axisLeft(yScale)
        .tickSize(0)

    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)

   yAxisDraw.selectAll('text')
   .attr('dx', '-0.6em');


}

// START
d3.csv('data/movies.csv', normalize).then(data => main(data))
