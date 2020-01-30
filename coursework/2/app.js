

// Configure D3 date function to look for formatted date
const formattedDateParser = d3.timeParse('%Y-%m-%d')

// Functions to map special edge cases
const parseNA = string => string === 'NA' ? undefined : string // converts 'NA' string to undefined
const parseDate = string => formattedDateParser(string) // converts to date objects

// Root mapping function to map over each object of data
const dataNormalizer = (d) => {
    return {
        budget: +d.budget,
        genre: parseNA(d.genre),
        id: +d.id,
        release_date: parseDate(d.release_date),
        release_year: parseDate(d.release_year),
        revenue: +d.revenue,
        runtime: +d.runtime,
        title: parseNA(d.title),
    }
}

// Begin Program
d3.csv('data/movies.csv', dataNormalizer)
.then((res) => {
    console.log(res[0], res[1])
})

