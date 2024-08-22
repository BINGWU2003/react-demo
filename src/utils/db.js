const db = `

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<style>
		/* hiprint-pagination */
		.hiprint-pagination {
			display: inline-block;
			padding-left: 0;
		}

		.hiprint-pagination>li {
			border: 1px solid #bdc3c7;
			-moz-border-radius: 2px;
			-webkit-border-radius: 2px;
			display: block;
			float: left;
			padding: 5px;
			text-decoration: none;
			margin-right: 5px;
			margin-bottom: 5px;
			font-family: helvetica;
			font-size: 13px;
			cursor: pointer
		}

		.hiprint-pagination>li>span {
			padding: 0 10px 0 10px;
		}

		.hiprint-pagination>li>a {
			color: #bdc3c7;
			font-weight: bold;
			text-decoration: none;
			font-size: 11px;
			padding: 3px;
		}

		.hiprint-pagination>li>a:hover {
			color: red;
		}



		.hiprint-pagination-sm>li>a {
			padding: 5px 10px;
			font-size: 12px;
			line-height: 1.5;
		}

		/*rect-printElement-type hiprint-printElement-type */
		.rect-printElement-types .hiprint-printElement-type {
			display: block;
		}

		.rect-printElement-types .hiprint-printElement-type {
			padding: 0 0 0 0;
			list-style: none;
		}

		.rect-printElement-types .hiprint-printElement-type>li>.title {
			display: block;
			padding: 4px 0px;
			clear: both;
		}

		.rect-printElement-types .hiprint-printElement-type>li>ul {
			padding: 0 0 0 0;
			display: block;
			list-style: none;
		}

		.rect-printElement-types .hiprint-printElement-type>li>ul>li {
			display: block;
			width: 50%;
			float: left;
			max-width: 100px;
		}

		.rect-printElement-types .hiprint-printElement-type>li>ul>li>a {
			height: 92px;
			padding: 12px 6px;
			margin-left: -1px;
			line-height: 1.42857143;
			color: #337ab7;
			text-decoration: none;
			background-color: #fff;
			border: 1px solid #ddd;
			margin-right: 5px;
			width: 95%;
			max-width: 100px;
			display: inline-block;
			text-align: center;
			margin-bottom: 7px;
			box-sizing: border-box;
			color: #b9a5a6;
			border: 1px solid rgba(0, 0, 0, 0.2);
			border-radius: 3px;
			box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
		}


		/*small-printElement-type hiprint-printElement-type */
		.small-printElement-types .hiprint-printElement-type {
			display: block;
		}

		.small-printElement-types .hiprint-printElement-type {
			padding: 0 0 0 0;
			list-style: none;
		}

		.small-printElement-types .hiprint-printElement-type>li>.title {
			display: block;
			padding: 4px 0px;
			clear: both;
		}

		.small-printElement-types .hiprint-printElement-type>li>ul {
			padding: 0 0 0 0;
			display: block;
			list-style: none;
			width: 100%;
		}

		.small-printElement-types .hiprint-printElement-type>li>ul>li {
			display: block;
			width: 50%;
			float: left;
			padding: 0 4px;
		}

		.small-printElement-types .hiprint-printElement-type>li>ul>li>a {
			height: 22px;
			/* padding: 12px 6px; */
			/* margin-left: -1px; */
			line-height: 20px;
			color: #337ab7;
			text-decoration: none;
			background-color: #fff;
			border: 1px solid #ddd;
			margin-right: 5px;
			width: 100%;
			display: block;
			text-align: center;
			margin-bottom: 7px;
			box-sizing: border-box;
			color: #b9a5a6;
			border: 1px solid rgba(0, 0, 0, 0.2);
			border-radius: 3px;
			box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
		}


		/* hiprint-toolbar*/

		.hiprint-toolbar {}

		.hiprint-toolbar>ul {
			padding: 0px;
			margin-bottom: 5px;
		}

		.hiprint-toolbar>ul>li {
			display: inline-block;
		}

		.hiprint-toolbar>ul>li>a {
			position: relative;
			float: left;
			padding: 3px 10px;
			margin-left: -1px;
			line-height: 1.42857143;
			color: #337ab7;
			text-decoration: none;
			background-color: #fff;
			border: 1px solid #ddd;
			margin-right: 4px;
			cursor: pointer;
		}


		.hiprint-printElement-type .glyphicon-class {
			display: block;
			text-align: center;
			word-wrap: break-word;
			/*font-size: 0.65rem;
			font-weight: normal;*/
			font-family: Helvetica, sans-serif;
		}

		.hiprint-printElement-type .glyphicon {
			margin-top: 5px;
			margin-bottom: 10px;
			font-size: 37px;
		}


		/*
			
			
			*/

		/*option css*/
		/*option css*/
		.hiprint-option-items {
			font-size: .75rem;
			padding: 10px 5px;
			display: flex;
			flex-wrap: wrap;
			align-items: flex-end;
			box-sizing: border-box;
			width: 100%;
		}

		.hiprint-option-items .hiprint-option-item {
			box-sizing: border-box;
			float: left;
			width: 50%;
			margin-bottom: 5px;
			padding: 0 5px;
		}

		.hiprint-option-items .hiprint-option-item-row {
			width: 100%;
		}

		.hiprint-option-item-label {
			margin: 5px 5px 3px 0;
		}

		.hiprint-option-items .hiprint-option-item-field input,
		.hiprint-option-items .hiprint-option-item-field select,
		.hiprint-option-items .hiprint-option-item-field textarea {
			color: inherit;
			background-color: transparent;
			box-sizing: border-box;
			width: 100%;
			position: relative;
			padding: 3px;
			z-index: 1;
			border: 1px solid rgb(169, 169, 169);
			height: 19pt;
		}

		.hiprint-option-item-settingBtn {
			height: 19pt;
			line-height: 19pt;
			font-size: 12px;
			padding: 0 24px;
			background: #00c1de;
			border-color: transparent;
			color: #fff;
			display: inline-block;
			margin: 5px;
			font-weight: 400;
			border: 1px solid transparent;
			font-family: PingFangSC, helvetica neue, hiragino sans gb, arial, microsoft yahei ui, microsoft yahei, simsun, "sans-serif";
			vertical-align: middle;
			transition: .3s cubic-bezier(.4, 0, .2, 1);
			transform: translateZ(0);
		}

		.hiprint-option-item-deleteBtn {
			background: red;
		}

		.hiprint-option-items .minicolors {
			position: relative;
		}

		.hiprint-option-items .minicolors-sprite {
			background-image: url(./image/jquery.minicolors.png);
		}

		.hiprint-option-items .minicolors-swatch {
			position: absolute;
			vertical-align: middle;
			background-position: -80px 0;
			cursor: text;
			padding: 0;
			margin: 0;
			display: inline-block;
		}

		.hiprint-option-items .minicolors-swatch-color {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}

		.hiprint-option-items .minicolors input[type=hidden]+.minicolors-swatch {
			width: 28px;
			position: static;
			cursor: pointer;
		}

		.hiprint-option-items .minicolors input[type=hidden][disabled]+.minicolors-swatch {
			cursor: default;
		}

		/* Panel */
		.hiprint-option-items .minicolors-panel {
			position: absolute;
			width: 173px;
			background: white;
			border: solid 1px #CCC;
			box-shadow: 0 0 20px rgba(0, 0, 0, .2);
			z-index: 99999;
			box-sizing: content-box;
			display: none;
		}

		.hiprint-option-items .minicolors-panel.minicolors-visible {
			display: block;
		}

		/* Panel positioning */
		.hiprint-option-items .minicolors-position-top .minicolors-panel {
			top: -154px;
		}

		.hiprint-option-items .minicolors-position-right .minicolors-panel {
			right: 0;
		}

		.hiprint-option-items .minicolors-position-bottom .minicolors-panel {
			top: auto;
		}

		.hiprint-option-items .minicolors-position-left .minicolors-panel {
			left: 0;
		}

		.hiprint-option-items .minicolors-with-opacity .minicolors-panel {
			width: 194px;
		}

		.hiprint-option-items .minicolors .minicolors-grid {
			position: relative;
			top: 1px;
			left: 1px;
			/* LTR */
			width: 150px;
			height: 150px;
			margin-bottom: 2px;
			background-position: -120px 0;
			cursor: crosshair;
		}

		.hiprint-option-items .minicolors .minicolors-grid-inner {
			position: absolute;
			top: 0;
			left: 0;
			width: 150px;
			height: 150px;
		}

		.hiprint-option-items .minicolors-slider-saturation .minicolors-grid {
			background-position: -420px 0;
		}

		.hiprint-option-items .minicolors-slider-saturation .minicolors-grid-inner {
			background-position: -270px 0;
			background-image: inherit;
		}

		.hiprint-option-items .minicolors-slider-brightness .minicolors-grid {
			background-position: -570px 0;
		}

		.hiprint-option-items .minicolors-slider-brightness .minicolors-grid-inner {
			background-color: black;
		}

		.hiprint-option-items .minicolors-slider-wheel .minicolors-grid {
			background-position: -720px 0;
		}

		.hiprint-option-items .minicolors-slider,
		.hiprint-option-items .minicolors-opacity-slider {
			position: absolute;
			top: 1px;
			left: 152px;
			/* LTR */
			width: 20px;
			height: 150px;
			background-color: white;
			background-position: 0 0;
			cursor: row-resize;
		}

		.hiprint-option-items .minicolors-slider-saturation .minicolors-slider {
			background-position: -60px 0;
		}

		.hiprint-option-items .minicolors-slider-brightness .minicolors-slider {
			background-position: -20px 0;
		}

		.hiprint-option-items .minicolors-slider-wheel .minicolors-slider {
			background-position: -20px 0;
		}

		.hiprint-option-items .minicolors-opacity-slider {
			left: 173px;
			/* LTR */
			background-position: -40px 0;
			display: none;
		}


		.hiprint-option-items .minicolors-with-opacity .minicolors-opacity-slider {
			display: block;
		}

		/* Pickers */
		.hiprint-option-items .minicolors-grid .minicolors-picker {
			position: absolute;
			top: 70px;
			left: 70px;
			width: 12px;
			height: 12px;
			border: solid 1px black;
			border-radius: 10px;
			margin-top: -6px;
			margin-left: -6px;
			background: none;
		}

		.hiprint-option-items .minicolors-grid .minicolors-picker>div {
			position: absolute;
			top: 0;
			left: 0;
			width: 8px;
			height: 8px;
			border-radius: 8px;
			border: solid 2px white;
			box-sizing: content-box;
		}

		.hiprint-option-items .minicolors-picker {
			position: absolute;
			top: 0;
			left: 0;
			width: 18px;
			height: 2px;
			background: white;
			border: solid 1px black;
			margin-top: -2px;
			box-sizing: content-box;
		}

		/* Swatches */
		.hiprint-option-items .minicolors-swatches,
		.hiprint-option-items .minicolors-swatches li {
			margin: 5px 0 3px 5px;
			/* LTR */
			padding: 0;
			list-style: none;
			overflow: hidden;
		}

		.hiprint-option-items .minicolors-swatches .minicolors-swatch {
			position: relative;
			float: left;
			/* LTR */
			cursor: pointer;
			margin: 0 4px 0 0;
			/* LTR */
		}


		.hiprint-option-items .minicolors-with-opacity .minicolors-swatches .minicolors-swatch {
			margin-right: 7px;
			/* LTR */
		}


		.hiprint-option-items .minicolors-swatch.selected {
			border-color: #000;
		}

		/* Inline controls */
		.hiprint-option-items .minicolors-inline {
			display: inline-block;
		}

		.hiprint-option-items .minicolors-inline .minicolors-input {
			display: none !important;
		}

		.hiprint-option-items .minicolors-inline .minicolors-panel {
			position: relative;
			top: auto;
			left: auto;
			/* LTR */
			box-shadow: none;
			z-index: auto;
			display: inline-block;
		}



		/* Bootstrap theme */
		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-swatch {
			z-index: 2;
			top: 3px;
			left: 3px;
			width: 17px;
			height: 17px;
		}

		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-swatches .minicolors-swatch {
			margin-bottom: 2px;
			top: 0;
			left: 0;
			/* LTR */
			width: 20px;
			height: 20px;
		}

		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-swatch-color {
			border-radius: inherit;
		}

		.hiprint-option-items .minicolors-theme-bootstrap.minicolors-position-right>.minicolors-swatch {
			left: auto;
			/* LTR */
			right: 3px;
			/* LTR */
		}

		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-input {
			float: none;
			padding-left: 23px;
			/* LTR */
		}

		.hiprint-option-items .minicolors-theme-bootstrap.minicolors-position-right .minicolors-input {
			padding-right: 44px;
			/* LTR */
			padding-left: 12px;
			/* LTR */
		}

		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-input.input-lg+.minicolors-swatch {
			top: 4px;
			left: 4px;
			/* LTR */
			width: 37px;
			height: 37px;
			border-radius: 5px;
		}

		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-input.input-sm+.minicolors-swatch {
			width: 24px;
			height: 24px;
		}

		.hiprint-option-items .minicolors-theme-bootstrap .minicolors-input.input-xs+.minicolors-swatch {
			width: 18px;
			height: 18px;
		}

		.hiprint-option-items .input-group .minicolors-theme-bootstrap:not(:first-child) .minicolors-input {
			border-top-left-radius: 0;
			/* LTR */
			border-bottom-left-radius: 0;
			/* LTR */
		}



		/*hitable reizer*/
		.hitable {}



		.hitable .selected {
			background: #3e66ad;
		}


		/*resizer*/
		.hitable tr.resizerRow,
		.hitable .resizerRow td {
			border: 0pt dashed;
			height: 0pt;
			background: #fff;
		}

		.hitable tr.resizerRow+tr,
		.hitable tr.resizerRow+tr td {
			border-top: 0px !important;
		}

		.hitable td.resizerColumn {
			border: 0pt dashed;
			width: 0.000001px !important;
			background: #fff;
		}


		.hitable td.resizerColumn+td {
			border-left: 0px !important;
		}


		/*GRIP*/

		.columngrips {
			height: 0px;
			position: absolute;
		}

		.columngrip {
			margin-left: -5px;
			position: absolute;
			z-index: 5;
			width: 10px;
		}

		.columngrip .gripResizer {
			position: absolute;
			filter: alpha(opacity=1);
			opacity: 0;
			width: 10px;
			height: 100%;
			cursor: col-resize;
			top: 0px;
		}

		.columngripDraging {
			border-left: 1px dotted black;
		}

		.rowgrips {
			height: 0px;
			width: 0px;
			position: absolute;
		}

		.rowgrip {
			margin-top: -5px;
			position: absolute;
			z-index: 5;
			height: 10px;
		}

		.rowgrip .gripResizer {
			position: absolute;
			filter: alpha(opacity=1);
			opacity: 0;
			height: 10px;
			width: 100%;
			cursor: row-resize;
			left: 0px;
		}

		.rowgripDraging {
			border-top: 1px dotted black;
		}

		.hitable .hitable-editor-text {
			border: 1px solid;
			width: 95%;
			height: 80%;
		}




		.hipanel-disable {
			height: 0px;
			display: block !important;
			top: 8500px;
			width: 0px;
			overflow: hidden;
			position: absolute;
		}

		.hiprint_rul_wrapper {
			position: absolute;
			height: 100%;
			width: 100%;
			overflow: hidden;
			pointer-events: none;
			border: 0;
			border-top: 1px solid rgb(201, 190, 190);
			border-left: 1px solid rgb(201, 190, 190);
			padding-left: 15px;
			margin: -16px
		}

		.hiprint_rul_wrapper .h_img {
			position: absolute;
			top: 0px;
			left: 15px;
			width: 400mm;
			height: 15px;
		}

		.hiprint_rul_wrapper .v_img {
			width: 400mm;
			transform: rotate(90deg);
			transform-origin: 0 100%;
			height: 15px;
			position: absolute;
			top: -2px;
			left: 0px;
		}

		/*hiprint-option-table*/

		.hiprint-option-table-selected-columns {
			color: inherit;
			background-color: transparent;
			box-sizing: border-box;
			width: 100%;
			position: relative;
			padding: 0px;
			list-style: none;
		}

		.hiprint-option-table-selected-columns .hiprint-option-table-selected-item {
			color: inherit;
			background-color: transparent;
			box-sizing: border-box;
			width: 100%;
			padding: 0 3px;
			border: 1px solid rgb(169, 169, 169);
			line-height: 19pt;
			margin: 3px 0;
		}

		/*hi-pretty */
		.hi-pretty * {
			box-sizing: border-box;
		}

		.hi-pretty input:not([type='checkbox']):not([type='radio']) {
			display: none;
		}

		.hi-pretty {
			position: relative;
			display: inline-block;
			margin-right: 1em;
			white-space: nowrap;
			line-height: 1;
		}

		.hi-pretty input {
			position: absolute;
			left: 0;
			top: 0;
			min-width: 1em;
			width: 100%;
			height: 100%;
			z-index: 2;
			opacity: 0;
			margin: 0;
			padding: 0;
			cursor: pointer;
		}

		.hi-pretty .state label {
			position: initial;
			display: inline-block;
			font-weight: normal;
			margin: 0;
			text-indent: 1.5em;
			min-width: calc(1em + 2px);
		}

		.hi-pretty .state label:before,
		.hi-pretty .state label:after {
			content: '';
			width: calc(1em + 2px);
			height: calc(1em + 2px);
			display: block;
			box-sizing: border-box;
			border-radius: 0;
			border: 1px solid transparent;
			z-index: 0;
			position: absolute;
			left: 0;
			top: calc((0% - (100% - 1em)) - 8%);
			background-color: transparent;
		}

		.hi-pretty .state label:before {
			border-color: #bdc3c7;
		}

		.hi-pretty .state.p-is-hover,
		.hi-pretty .state.p-is-indeterminate {
			display: none;
		}


		.hi-pretty.p-default.p-fill .state label:after {
			-webkit-transform: scale(1);
			-ms-transform: scale(1);
			transform: scale(1);
		}

		.hi-pretty.p-default .state label:after {
			-webkit-transform: scale(0.6);
			-ms-transform: scale(0.6);
			transform: scale(0.6);
		}

		.hi-pretty.p-default input:checked~.state label:after {
			background-color: #bdc3c7 !important;
		}

		.hi-pretty.p-default.p-thick .state label:before,
		.hi-pretty.p-default.p-thick .state label:after {
			border-width: calc(1em / 7);
		}

		.hi-pretty.p-default.p-thick .state label:after {
			-webkit-transform: scale(0.4) !important;
			-ms-transform: scale(0.4) !important;
			transform: scale(0.4) !important;
		}
	</style>




	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css"
		integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
	<style>
		@media print {
			body {
				margin: 0px;
				padding: 0px;
			}
		}

		@page {
			margin: 0;
		}

		.hiprint-printPaper * {
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			/* Firefox */
			-webkit-box-sizing: border-box;
			/* Safari */

		}

		.hiprint-printPaper *:focus {
			outline: -webkit-focus-ring-color auto 0px;
		}


		.hiprint-page-break-avoid {
			page-break-after: avoid;
		}

		.hiprint-printPaper {
			position: relative;
			padding: 0 0 0 0;
			page-break-after: always;
			overflow-x: hidden;
			overflow: hidden;
		}

		.hiprint-printPaper .hiprint-printPaper-content {
			position: relative;
		}

		.hiprint-printPaper.design {
			overflow: visible;
		}



		.hiprint-printTemplate .hiprint-printPanel {
			page-break-after: always;
		}

		.hiprint-printPaper,
		hiprint-printPanel {
			box-sizing: border-box;
			border: 0px;
		}

		.hiprint-printPanel .hiprint-printPaper:last-child {
			page-break-after: avoid;
		}

		.hiprint-printTemplate .hiprint-printPanel:last-child {
			page-break-after: avoid;
		}

		.hiprint-printPaper .hideheaderLinetarget {
			border-top: 0px dashed rgb(201, 190, 190) !important;
		}

		.hiprint-printPaper .hidefooterLinetarget {
			border-top: 0px dashed rgb(201, 190, 190) !important;
		}

		.hiprint-printPaper.design {
			border: 1px dashed rgba(170, 170, 170, 0.7);
		}

		.design .hiprint-printElement-table-content,
		.design .hiprint-printElement-longText-content {
			overflow: hidden;
			box-sizing: border-box;
		}

		.design .resize-panel {
			box-sizing: border-box;
			border: 1px dotted;
		}

		.hiprint-printElement-text {
			background-color: transparent;
			background-repeat: repeat;
			padding: 0 0 0 0;
			border: 0.75pt none rgb(0, 0, 0);
			direction: ltr;
			font-family: 'SimSun';
			font-size: 9pt;
			font-style: normal;
			font-weight: normal;
			padding-bottom: 0pt;
			padding-left: 0pt;
			padding-right: 0pt;
			padding-top: 0pt;
			text-align: left;
			text-decoration: none;
			line-height: 9.75pt;
			box-sizing: border-box;
			word-wrap: break-word;
			word-break: break-all;
		}

		.design .hiprint-printElement-text-content {
			border: 1px dashed rgb(206, 188, 188);
			box-sizing: border-box;
		}

		.hiprint-printElement-longText {
			background-color: transparent;
			background-repeat: repeat;
			border: 0.75pt none rgb(0, 0, 0);
			direction: ltr;
			font-family: 'SimSun';
			font-size: 9pt;
			font-style: normal;
			font-weight: normal;
			padding-bottom: 0pt;
			padding-left: 0pt;
			padding-right: 0pt;
			padding-top: 0pt;
			text-align: left;
			text-decoration: none;
			line-height: 9.75pt;
			box-sizing: border-box;
			word-wrap: break-word;
			word-break: break-all;
			/*white-space: pre-wrap*/
		}



		.hiprint-printElement-table {
			background-color: transparent;
			background-repeat: repeat;
			color: rgb(0, 0, 0);
			border-color: rgb(0, 0, 0);
			border-style: none;
			direction: ltr;
			font-family: 'SimSun';
			font-size: 9pt;
			font-style: normal;
			font-weight: normal;
			padding-bottom: 0pt;
			padding-left: 0pt;
			padding-right: 0pt;
			padding-top: 0pt;
			text-align: left;
			text-decoration: none;
			padding: 0 0 0 0;
			box-sizing: border-box;
			line-height: 9.75pt;
		}

		.hiprint-printElement-table thead {
			background: #e8e8e8;
			font-weight: 700;
		}

		.hiprint-printElement-tableTarget,
		.hiprint-printElement-tableTarget tr,
		.hiprint-printElement-tableTarget td {
			border-color: rgb(0, 0, 0);
			border-style: none;
			border: 1px solid rgb(0, 0, 0);
			font-weight: normal;
			direction: ltr;
			padding-bottom: 0pt;
			padding-left: 0pt;
			padding-right: 0pt;
			padding-top: 0pt;
			text-decoration: none;
			vertical-align: middle;
			box-sizing: border-box;
			word-wrap: break-word;
			word-break: break-all;
			/*line-height: 9.75pt;
					font-size: 9pt;*/
		}

		/*.hiprint-printElement-tableTarget tr,*/
		.hiprint-printElement-tableTarget td {
			height: 18pt;
		}

		.hiprint-printPaper .hiprint-paperNumber {
			font-size: 9pt;
		}

		.design .hiprint-printElement-table-handle {
			position: absolute;
			height: 21pt;
			width: 21pt;
			background: red;
			z-index: 1;
		}

		.hiprint-printPaper .hiprint-paperNumber-disabled {
			float: right !important;
			right: 0 !important;
			color: gainsboro !important;
		}

		.hiprint-printElement-vline,
		.hiprint-printElement-hline {
			border: 0px none rgb(0, 0, 0);

		}

		.hiprint-printElement-vline {
			border-left: 0.75pt solid #000;
			border-right: 0px none rgb(0, 0, 0) !important;
			border-bottom: 0px none rgb(0, 0, 0) !important;
			border-top: 0px none rgb(0, 0, 0) !important;
		}

		.hiprint-printElement-hline {
			border-top: 0.75pt solid #000;
			border-right: 0px none rgb(0, 0, 0) !important;
			border-bottom: 0px none rgb(0, 0, 0) !important;
			border-left: 0px none rgb(0, 0, 0) !important;
		}

		.hiprint-printElement-oval,
		.hiprint-printElement-rect {
			border: 0.75pt solid #000;
		}

		.hiprint-text-content-middle {
			display: table;
		}

		.hiprint-text-content-middle>div {
			display: table-cell;
			vertical-align: middle
		}

		.hiprint-text-content-bottom {
			display: table;
		}

		.hiprint-text-content-bottom>div {
			display: table-cell;
			vertical-align: bottom
		}

		/*hi-grid-row */
		.hi-grid-row {
			position: relative;
			height: auto;
			margin-right: 0;
			margin-left: 0;
			zoom: 1;
			display: block;
			box-sizing: border-box;
		}

		.hi-grid-row::after,
		.hi-grid-row::before {
			display: table;
			content: '';
			box-sizing: border-box;
		}

		.hi-grid-col {
			display: block;
			box-sizing: border-box;
			position: relative;
			float: left;
			flex: 0 0 auto;
		}

		.table-grid-row {
			margin-left: -0pt;
			margin-right: -0pt;
		}

		.tableGridColumnsGutterRow {
			padding-left: 0pt;
			padding-right: 0pt;
		}

		.hiprint-gridColumnsFooter {
			text-align: left;
			clear: both;
		}
	</style>

</head>

<body>
	<div id="printPreview">
		<div class="hiprint-printPanel panel-index-0">
			<style printstyle="">
				@page {
					border: 0;
					padding: 0cm;
					margin: 0cm;
					size: 40mm 81mm;
				}
			</style>
			<div class="hiprint-printPaper" original-height="81" style="width: 40mm; height: 80mm;">
				<div class="hiprint-printPaper-content">
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 109.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 10.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							校服裤子</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; left: 1.5pt; top: 37.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							床号：11</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 49.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							码子：XL/黑色</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 108pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12.75pt; font-weight: bolder; left: 1.5pt; top: 76.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							条数：11</div>
					</div>
					<div class="hiprint-printElement hiprint-printElement-image"
						style="position: absolute; width: 58.5pt; height: 56.5pt; left: 3pt; top: 96pt;">
						<div class="hiprint-printElement-image-content" style="height:100%;width:100%"><img
								style="width: 100%; height: 100%; content: url(&quot;http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg&quot;) !important;"
								src="http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg"></div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 37.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; left: 63pt; top: 117pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 46.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 7.5pt; font-weight: bolder; left: 63pt; top: 133.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							扎号：1</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-weight: bolder; text-align: center; left: 0pt; top: 160.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div><span class="hiprint-paperNumber"
						style="position: absolute; top: 204pt; left: 82.5pt; display: none;">1-1</span>
				</div>
			</div>
		</div>
		<div class="hiprint-printPanel panel-index-0">
			<style printstyle="">
				@page {
					border: 0;
					padding: 0cm;
					margin: 0cm;
					size: 40mm 81mm;
				}
			</style>
			<div class="hiprint-printPaper" original-height="81" style="width: 40mm; height: 80mm;">
				<div class="hiprint-printPaper-content">
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 109.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 10.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							校服裤子</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; left: 1.5pt; top: 37.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							床号：11</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 49.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							码子：XL/黑色</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 108pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12.75pt; font-weight: bolder; left: 1.5pt; top: 76.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							条数：11</div>
					</div>
					<div class="hiprint-printElement hiprint-printElement-image"
						style="position: absolute; width: 58.5pt; height: 56.5pt; left: 3pt; top: 96pt;">
						<div class="hiprint-printElement-image-content" style="height:100%;width:100%"><img
								style="width: 100%; height: 100%; content: url(&quot;http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg&quot;) !important;"
								src="http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg"></div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 37.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; left: 63pt; top: 117pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 46.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 7.5pt; font-weight: bolder; left: 63pt; top: 133.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							扎号：1</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-weight: bolder; text-align: center; left: 0pt; top: 160.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div><span class="hiprint-paperNumber"
						style="position: absolute; top: 204pt; left: 82.5pt; display: none;">1-1</span>
				</div>
			</div>
		</div>
		<div class="hiprint-printPanel panel-index-0">
			<style printstyle="">
				@page {
					border: 0;
					padding: 0cm;
					margin: 0cm;
					size: 40mm 81mm;
				}
			</style>
			<div class="hiprint-printPaper" original-height="81" style="width: 40mm; height: 80mm;">
				<div class="hiprint-printPaper-content">
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 109.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 10.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							校服裤子</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; left: 1.5pt; top: 37.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							床号：11</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 49.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							码子：XL/黑色</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 108pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12.75pt; font-weight: bolder; left: 1.5pt; top: 76.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							条数：11</div>
					</div>
					<div class="hiprint-printElement hiprint-printElement-image"
						style="position: absolute; width: 58.5pt; height: 56.5pt; left: 3pt; top: 96pt;">
						<div class="hiprint-printElement-image-content" style="height:100%;width:100%"><img
								style="width: 100%; height: 100%; content: url(&quot;http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg&quot;) !important;"
								src="http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg"></div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 37.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; left: 63pt; top: 117pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 46.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 7.5pt; font-weight: bolder; left: 63pt; top: 133.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							扎号：1</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-weight: bolder; text-align: center; left: 0pt; top: 160.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div><span class="hiprint-paperNumber"
						style="position: absolute; top: 204pt; left: 82.5pt; display: none;">1-1</span>
				</div>
			</div>
		</div>
		<div class="hiprint-printPanel panel-index-0">
			<style printstyle="">
				@page {
					border: 0;
					padding: 0cm;
					margin: 0cm;
					size: 40mm 81mm;
				}
			</style>
			<div class="hiprint-printPaper" original-height="81" style="width: 40mm; height: 80mm;">
				<div class="hiprint-printPaper-content">
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 109.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 10.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							校服裤子</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; left: 1.5pt; top: 37.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							床号：11</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 49.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							码子：XL/黑色</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 108pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12.75pt; font-weight: bolder; left: 1.5pt; top: 76.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							条数：11</div>
					</div>
					<div class="hiprint-printElement hiprint-printElement-image"
						style="position: absolute; width: 58.5pt; height: 56.5pt; left: 3pt; top: 96pt;">
						<div class="hiprint-printElement-image-content" style="height:100%;width:100%"><img
								style="width: 100%; height: 100%; content: url(&quot;http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg&quot;) !important;"
								src="http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg"></div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 37.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; left: 63pt; top: 117pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 46.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 7.5pt; font-weight: bolder; left: 63pt; top: 133.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							扎号：1</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-weight: bolder; text-align: center; left: 0pt; top: 160.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div><span class="hiprint-paperNumber"
						style="position: absolute; top: 204pt; left: 82.5pt; display: none;">1-1</span>
				</div>
			</div>
		</div>
		<div class="hiprint-printPanel panel-index-0">
			<style printstyle="">
				@page {
					border: 0;
					padding: 0cm;
					margin: 0cm;
					size: 40mm 81mm;
				}
			</style>
			<div class="hiprint-printPaper" original-height="81" style="width: 40mm; height: 80mm;">
				<div class="hiprint-printPaper-content">
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 109.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 10.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							校服裤子</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; left: 1.5pt; top: 37.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							床号：11</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12pt; font-weight: bolder; line-height: 12.75pt; left: 1.5pt; top: 49.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							码子：XL/黑色</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 108pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 12.75pt; font-weight: bolder; left: 1.5pt; top: 76.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							条数：11</div>
					</div>
					<div class="hiprint-printElement hiprint-printElement-image"
						style="position: absolute; width: 58.5pt; height: 56.5pt; left: 3pt; top: 96pt;">
						<div class="hiprint-printElement-image-content" style="height:100%;width:100%"><img
								style="width: 100%; height: 100%; content: url(&quot;http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg&quot;) !important;"
								src="http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150276880977920.jpg"></div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 37.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; left: 63pt; top: 117pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 46.5pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-size: 7.5pt; font-weight: bolder; left: 63pt; top: 133.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
							扎号：1</div>
					</div>
					<div tabindex="1" class="hiprint-printElement hiprint-printElement-text"
						style="position: absolute; width: 111pt; height: 10.75pt; font-family: &quot;Microsoft YaHei&quot;; font-weight: bolder; text-align: center; left: 0pt; top: 160.5pt;">
						<div class="hiprint-printElement-text-content hiprint-printElement-content" style="height:100%;width:100%">
						</div>
					</div><span class="hiprint-paperNumber"
						style="position: absolute; top: 204pt; left: 82.5pt; display: none;">1-1</span>
				</div>
			</div>
		</div>
	</div>
</body>
`

export default db