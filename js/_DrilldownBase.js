/*global define, console, document */

/*
 | Copyright 2015 ESRI (UK) Limited
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */

define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'esri/request',
    'dojo/i18n!./nls/Drilldown'
],
function (declare, _Widget, esriRequest, i18n) {
    // module:
    //      _LocatorBase

    return declare([_Widget], {
        // summary:
        //		Base class for the Drilldown Locator widget.

        _isNullOrEmpty: function (/*Anything*/ obj) {
            // summary:
            //		Checks to see if the passed in thing is undefined, null or empty.
            // tags:
            //		private

            return (obj === undefined || obj === null || obj === '');
        },

        _fieldReplace: function (/*String*/text, /*Object Array*/attributes) {
            // summary:
            //		Replaces any fields in the text with the values for the fields.
            // tags:
            //		private

            var desc = text, field;

            for (field in attributes) {
                if (attributes.hasOwnProperty(field)) {
                    if (text.indexOf(field) > -1) {
                        desc = desc.replace('{' + field + '}', attributes[field]);
                    }
                }
            }

            return desc;
        }

    });
});