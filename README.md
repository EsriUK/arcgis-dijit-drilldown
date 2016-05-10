arcgis-dijit-drilldown
====================
[![Build Status](https://travis-ci.org/EsriUK/arcgis-dijit-drilldown.svg?branch=master)](https://travis-ci.org/EsriUK/arcgis-dijit-drilldown) [![Coverage Status](https://coveralls.io/repos/EsriUK/arcgis-dijit-drilldown/badge.svg?branch=master)](https://coveralls.io/r/EsriUK/arcgis-dijit-drilldown?branch=master) [![Code Climate](https://codeclimate.com/github/EsriUK/arcgis-dijit-drilldown/badges/gpa.svg)](https://codeclimate.com/github/EsriUK/arcgis-dijit-drilldown)

## Features
The drilldown widget provides hierarchical address search results allowing the user to drilldown into the list of results and find a specific location.

For further information on when this might be useful to you, demo sites and details on how to get started using the widget please see our [blog](http://communityhub.esriuk.com/geoxchange/2015/11/23/need-a-more-flexible-way-to-search-for-addresses?rq=drilldown).

The drilldown widget extends the functionality of the Esri Search widget, this means you use it in the same way. See the Esri Search widget doc [here](https://developers.arcgis.com/javascript/jsapi/search-amd.html)

[View it live](http://appsstage.esriuk.com/app/Drilldown-demo/50/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html)

A build of the Drilldown widget is available for use with the [Web AppBuilder](https://developers.arcgis.com/web-appbuilder/) and can be found [here](https://github.com/EsriUK/wab-dijit-drilldown)

The [wiki](https://github.com/EsriUK/arcgis-dijit-drilldown/wiki) provides information on supported locators, browsers and using a standardised schema.

## Quickstart

```javascript	
myWidget = new Drilldown({
	sources: [{
		locator: new LLPGLocator("http://myserver/mylocator/ADDRESS/GeocodeServer"),
        singleLineFieldName: "LH_ADDRESS",
        outFields: ["*"],
        name: "LH 5.3 LLPG",
        maxResults: 250	
	}],
	enableSuggestions: false,
    enableLabel: false,
    enableHighlight: true,
    autoNavigate: true,
    showCounts: true
}, "DrilldownWidget");

myWidget.startup();
```
 [New to Github? Get started here.](https://github.com/)


## Requirements
- ArcGIS Online or Portal for ArcGIS 10.4
- JavaScript API v3.14 or above
- Supported Browsers, these can be found [here](https://github.com/EsriUK/arcgis-dijit-drilldown/wiki/Supported-Browsers)
- LocatorHub 5.3 (or above) and one of the following locators:
	- Addressbase Premium (Epoch 39 or above, requires LocatorHub 5.4)
	- LLPG
	- IDOX GMS
	- One Scotland Gazetteer
	- Merge or Cascade locators using an appropriate standardised schema.
	  For further information on the schema please see [here](https://github.com/EsriUK/arcgis-dijit-drilldown/wiki/Standardised-Schema)
- Experience with the [ArcGIS Javascript API](https://developers.arcgis.com/javascript/jsapi/).


## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Support

Use of this widget is covered by [Esri UK Developer Support](http://www.esriuk.com/support/support-services)

## Contributing

Anyone and everyone is welcome to contribute.


## Licensing

Copyright 2015 ESRI (UK) Limited

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the Licence.

A copy of the license is available in the repository's [license](LICENSE) file.
