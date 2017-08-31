/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 120);
/******/ })
/************************************************************************/
/******/ ({

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toSeconds = function toSeconds(ms) {
	return String((ms / 1000).toPrecision(3)).substring(0, 4);
};

function messageHandler(payload, sender, sendResponse) {
	if (payload.type === 'UPDATE_DURATION') {
		chrome.browserAction.setBadgeText({ text: toSeconds(payload.duration), tabId: sender.tab.id });
	}
	if (payload.type === 'UPDATE_MEASUREMENTS') {
		chrome.storage.local.get('cache', function (data) {
			if (!data.cache) data.cache = {};
			var measurementsData = data.cache['tab' + sender.tab.id];
			if (!measurementsData) {
				measurementsData = [];
			}
			measurementsData.push(payload.measurements);
			// Senna average data
			var sennaMeasurements = measurementsData.filter(function (m) {
				return m.spa === true;
			});
			if (sennaMeasurements.length > 0) {
				payload.measurements.averageSennaDuration = sennaMeasurements.reduce(function (sum, m) {
					return sum + m.duration;
				}, 0) / sennaMeasurements.length;
			} else {
				payload.measurements.averageSennaDuration = 0;
			}
			payload.measurements.sennaNavigationCount = sennaMeasurements.length;
			// Regular navigation average data
			var regularMeasurements = measurementsData.filter(function (m) {
				return m.spa === false;
			});
			if (regularMeasurements.length > 0) {
				payload.measurements.averageRegularDuration = regularMeasurements.reduce(function (sum, m) {
					return sum + m.duration;
				}, 0) / regularMeasurements.length;
			} else {
				payload.measurements.averageRegularDuration = 0;
			}
			payload.measurements.regularNavigationCount = regularMeasurements.length;
			// Persist data
			data.cache['tab' + sender.tab.id] = measurementsData;
			chrome.storage.local.set(data);
			sendResponse(payload.measurements);
		});
		return true;
	}
}

chrome.runtime.onMessage.addListener(messageHandler);
chrome.runtime.onMessageExternal.addListener(messageHandler);

chrome.tabs.onRemoved.addListener(function (tabId) {
	chrome.storage.local.get('cache', function (data) {
		if (data.cache) delete data.cache['tab' + tabId];
		chrome.storage.local.set(data);
	});
});

/***/ })

/******/ });