import moment from 'moment';

const formatDuration = (duration) => {
	if (duration > 999) {
		return moment.duration(duration).asSeconds().toPrecision(3) + ' seconds';
	}
	else {
		return moment.duration(duration).asMilliseconds().toPrecision(3) + ' ms';
	}
}

class Template {
	static getMeasurementsTable(context) {
		let style = 'min-width: 400px;margin: 5px;';
		if (context.displayInside) {
			style += 'z-index:999999999999;position:fixed;top:70px;right:10px;';
		}
		let alertClass = 'alert-info';
		if (context.spa) {
			alertClass = 'alert-success';
		}
		return `
		<div class="panel panel-primary" style="${style}">
			<div class="panel-heading">
				<h3 class="panel-title">Liferay Benchmark</h3>
			</div>
			<div class="alert ${alertClass}" role="alert" style="margin: 5px;">
				Page loaded in <strong>${formatDuration(context.duration)}</strong>` +
				(context.spa ? ` with Senna.js <img src="https://sennajs.com/images/logo.png" style="width: 40px;position: absolute;right: 10px;top: 3px;"/>` : '') +	
			`</div>
			<table class="table table-striped">
				<thead class="thead-inverse">
					<tr>
						<th>Measurement</th>
						<th>Count</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Loaded <span class="badge badge-info">&lt;script/&gt;</span> tags</td>
						<td text-align="center">${context.scriptsCount}</td>
						<td>${formatDuration(context.scriptsTime)}</td>
					</tr>
					<tr>
						<td>Loaded <span class="badge badge-info">&lt;link/&gt;</span> tags</td>
						<td text-align="center">${context.linksCount}</td>
						<td>${formatDuration(context.linksTime)}</td>
					</tr>
					<tr>
						<td>Average load time with Senna.js</td>
						<td text-align="center">${context.sennaNavigationCount}</td>
						<td>${formatDuration(context.averageSennaDuration)}</td>
					</tr>
					<tr>
						<td>Average load time without Senna.js</td>
						<td text-align="center">${context.regularNavigationCount}</td>
						<td>${formatDuration(context.averageRegularDuration)}</td>
					</tr>
				</tbody>
			</table>
		</div>`;
	}
}

export default Template;