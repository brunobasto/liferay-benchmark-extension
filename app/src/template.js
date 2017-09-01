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
		let style = 'width: 450px;margin: 5px;';
		if (context.displayInside) {
			style += 'z-index:999999999999;position:fixed;bottom:0px;right:calc(50% - 450px);';
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
				(context.spa ? ` with <img src="https://sennajs.com/images/logo.png" style="width: 40px;position: absolute;right: 10px;top: 3px;"/>` : ' without ') +
				`<strong>Senna.js</strong>` +
			`</div>
			<table class="table table-striped">
				<thead class="thead-inverse">
					<tr>
						<th>Measurement</th>
						<th style="text-align:center;">Count</th>
						<th style="text-align:center;">Time</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Loaded <span class="badge badge-info" style="font-size: 12px;font-family: Monospace;padding: 5px;">&lt;script/&gt;</span> tags</td>
						<td style="text-align:center;">${context.scriptsCount}</td>
						<td style="text-align:center;"> - </td>
					</tr>
					<tr>
						<td>Loaded <span class="badge badge-info" style="font-size: 12px;font-family: Monospace;padding: 5px;">&lt;link/&gt;</span> tags</td>
						<td style="text-align:center;">${context.linksCount}</td>
						<td style="text-align:center;"> - </td>
					</tr>
					<tr>
						<td>Average load time with Senna.js</td>
						<td style="text-align:center;">${context.sennaNavigationCount}</td>
						<td style="text-align:center;">${formatDuration(context.sennaDurationAverage)}</td>
					</tr>
					<tr>
						<td>Average load time without Senna.js</td>
						<td style="text-align:center;">${context.regularNavigationCount}</td>
						<td style="text-align:center;">${formatDuration(context.regularDurationAverage)}</td>
					</tr>
				</tbody>
			</table>
		</div>`;
	}
}

export default Template;