define(["dojo/_base/declare","./_LocatorBase"],function(a,b){var c=function(a){return void 0===a||null===a||""===a},d=function(a,b,d,e){var f=a.trim()+b.trim(),g=d.trim()+e.trim();return c(f)===!1&&c(g)===!1?f+"-"+g:f+g};return a([b],{locatorType:"LLPG",resultsPickList:null,streetGrouping:["STREET_DESCRIPTOR","LOCALITY_NAME","TOWN_NAME","ADMINISTRATIVE_AREA"],premiseGrouping:["PAO_TEXT","PAO_END_SUFFIX","PAO_END_NUMBER","PAO_START_SUFFIX","PAO_START_NUMBER"],streetFields:{STREET_DESCRIPTOR:"STREET_DESCRIPTOR",LOCALITY_NAME:"LOCALITY_NAME",TOWN_NAME:"TOWN_NAME",ADMINISTRATIVE_AREA:"ADMINISTRATIVE_AREA"},paoFields:{PAO_TEXT:"PAO_TEXT",PAO_START_NUMBER:"PAO_START_NUMBER",PAO_START_SUFFIX:"PAO_START_SUFFIX",PAO_END_NUMBER:"PAO_END_NUMBER",PAO_END_SUFFIX:"PAO_END_SUFFIX"},saoFields:{SAO_TEXT:"SAO_TEXT",SAO_START_NUMBER:"SAO_START_NUMBER",SAO_START_SUFFIX:"SAO_START_SUFFIX",SAO_END_NUMBER:"SAO_END_NUMBER",SAO_END_SUFFIX:"SAO_END_SUFFIX"},constructor:function(){this.inherited(arguments)},_getPAOText:function(a){var b="",e="",f=this.paoFields;return c(a[f.PAO_TEXT])===!1&&(b=a[f.PAO_TEXT].trim()),e=d(a[f.PAO_START_NUMBER],a[f.PAO_START_SUFFIX],a[f.PAO_END_NUMBER],a[f.PAO_END_SUFFIX]),c(e)===!1&&(b+=e),b.trim()},_getSAOText:function(a){var b="",e="",f=this.saoFields;return c(a[f.SAO_TEXT])===!1&&(b=a[f.SAO_TEXT].trim()),e=d(a[f.SAO_START_NUMBER],a[f.SAO_START_SUFFIX],a[f.SAO_END_NUMBER],a[f.SAO_END_SUFFIX]),c(e)===!1&&(b+=e),b.trim()},_getListLevelDescription:function(a,b){var c="",d=this.streetFields;switch(a){case 1:c=[this._getPAOText(b),b[d.STREET_DESCRIPTOR],b[d.LOCALITY_NAME],b[d.TOWN_NAME],b[d.ADMINISTRATIVE_AREA]].filter(Boolean).join(", ");break;case 2:c=[b[d.STREET_DESCRIPTOR].trim(),b[d.LOCALITY_NAME].trim(),b[d.TOWN_NAME].trim(),b[d.ADMINISTRATIVE_AREA].trim()].filter(Boolean).join(", ")}return c}})});