import moment from 'moment';
import Events from './events';
import Average from './average';

const formatDuration = (duration) => {
	if (duration > 999) {
		return moment.duration(duration).asSeconds().toPrecision(3) + ' seconds';
	}
	else {
		return moment.duration(duration).asMilliseconds().toPrecision(3) + ' ms';
	}
}

class Template {
	static getConfigurationsTemplate(context) {
		const displayInsideChecked = context.displayInside ? 'checked' : '';
		const sendUsageDataChecked = context.sendUsageData ? 'checked' : '';
		return `
			<div class="panel panel-default" style="width: 450px;margin: 5px;">
				<div class="panel-heading">
					<h3 class="panel-title">Settings</h3>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label aria-checked="false" for="lfrBenchmarkDisplayInside" role="checkbox">
							<input ${displayInsideChecked} class="toggle-switch" id="lfrBenchmarkDisplayInside" name="lfrBenchmarkDisplayInside" type="checkbox" value="true" />
							<span aria-hidden="true" class="toggle-switch-bar">
								<span class="toggle-switch-handle"></span>
							</span>
							<span class="toggle-switch-text toggle-switch-text-right">Display measurements inside page</span>
						</label>
					</div>
					<div class="form-group">
						<label aria-checked="false" for="lfrBenchmarkSendUsageData" role="checkbox">
							<input ${sendUsageDataChecked} class="toggle-switch" id="lfrBenchmarkSendUsageData" name="lfrBenchmarkSendUsageData" type="checkbox" value="true" />
							<span aria-hidden="true" class="toggle-switch-bar">
								<span class="toggle-switch-handle"></span>
							</span>
							<span class="toggle-switch-text toggle-switch-text-right">Send anonymous usage data (<strong>for Liferay websites only</strong>)</span>
						</label>
					</div>
				</div>
			</div>
		`;
	}

	static getMeasurementsTable(context) {
		const measurementsHistory = context.history;
		// Senna average data
		const sennaAverage = new Average(measurementsHistory.filter(m => m.spa === true));
		// Regular navigation average data
		const regularAverage = new Average(measurementsHistory.filter(m => m.spa === false));
		let style = 'width: 450px;margin: 5px;';
		if (context.displayInside) {
			style += 'z-index:999999999999;position:fixed;bottom:0px;left:calc(50% - 225px);';
		}
		let alertClass = 'alert-info';
		if (context.spa) {
			alertClass = 'alert-success';
		}
		let duration = 0;
		let linksCount = 0;
		let scriptsCount = 0;
		let spa = false;
		if (measurementsHistory.length) {
			const lastMeasurement = measurementsHistory[measurementsHistory.length - 1];
			duration = lastMeasurement.duration;
			scriptsCount = lastMeasurement.scriptsCount;
			linksCount = lastMeasurement.linksCount;
			spa = lastMeasurement.spa;
		}
		return `
		<div class="panel panel-primary" style="${style}">
			<div class="panel-heading">
				<h3 class="panel-title">Liferay Benchmark</h3>
			</div>
			<div class="alert ${alertClass}" role="alert" style="margin: 5px;">
				Page loaded in <strong>${formatDuration(duration)}</strong>` +
				(spa ? ` with <img src="https://sennajs.com/images/logo.png" style="width: 40px;position: absolute;right: 10px;top: 3px;"/>` : ' without ') +
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
						<td style="text-align:center;">${scriptsCount}</td>
						<td style="text-align:center;"> - </td>
					</tr>
					<tr>
						<td>Loaded <span class="badge badge-info" style="font-size: 12px;font-family: Monospace;padding: 5px;">&lt;link/&gt;</span> tags</td>
						<td style="text-align:center;">${linksCount}</td>
						<td style="text-align:center;"> - </td>
					</tr>
					<tr>
						<td>Average load time with Senna.js</td>
						<td style="text-align:center;">${sennaAverage.count}</td>
						<td style="text-align:center;">${formatDuration(sennaAverage.duration)}</td>
					</tr>
					<tr>
						<td>Average load time without Senna.js</td>
						<td style="text-align:center;">${regularAverage.count}</td>
						<td style="text-align:center;">${formatDuration(regularAverage.duration)}</td>
					</tr>
				</tbody>
			</table>
		</div>`;
	}
}

export default Template;