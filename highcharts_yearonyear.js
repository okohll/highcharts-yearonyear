function splitSeriesByYear(id) {
	var chart = $('#' + id).highcharts();
	var seriesType = chart.options.chart.defaultSeriesType;
	if ((seriesType == "bar") || (seriesType == "pie")) {
		// Unable to do year on year with these types
		return;
	}
	// get max year
	var max_year = 1990;
	$.each(chart.series, function(i, series) {
		$.each(series.data, function(j, data) {
			var date = new Date(data.category);
			var year = date.getFullYear();

			if (year > max_year) {
				max_year = year;
			}
		});
	});

	// get new series
	var new_series = [];
	$.each(chart.series, function(i, item) {
		var new_items = splitOneSeries(item, max_year);
		$.each(new_items, function(i, new_item) {
			new_series.push(new_item);
		});
	});

	while (chart.series.length > 0) {
		chart.series[0].remove(true);
	}

	$.each(new_series, function(i, item) {
		chart.addSeries(item);
	});
}

function splitOneSeries(series, max_year) {
	var years = [];
	var all_data = [];
	var new_series = [];
	$.each(series.data, function(i, data) {
		var date = new Date(data.category);
		var year = date.getFullYear();
		var month = date.getMonth();
		var date = date.getDate();
		if (years.indexOf(year) == -1) {
			years.push(year);
			new_series.push({
				name : series.name + " - " + year,
				data : []
			});
		}

		var index = years.indexOf(year);
		if (index == -1) {
			// This is probably because there's only 
			console.log("Unable to find year " + year + " from date " + data.category);
		} else {
			new_series[index].data
			.push([ Date.UTC(max_year, month, date), data.y ]);
		}
	});
	return new_series;
}
