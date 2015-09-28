define(["dojo/_base/declare","./_LocatorBase"],function(a,b){var c=function(a){return void 0===a||null===a||""===a};return a([b],{locatorType:"AGS_LLPG",resultsPickList:null,streetGrouping:["StreetDescriptor","LocalityName","Town","AdminArea"],premiseGrouping:["PAOText","PAONumberRange"],titleCase:!1,streetFields:{STREET_DESCRIPTOR:"StreetDescriptor",LOCALITY_NAME:"LocalityName",TOWN_NAME:"Town",ADMINISTRATIVE_AREA:"AdminArea"},paoFields:{PAO_TEXT:"PAOText",PAO_START_NUMBER:"PAO_START_NUMBER",PAO_START_SUFFIX:"PAO_START_SUFFIX",PAO_END_NUMBER:"PAO_END_NUMBER",PAO_END_SUFFIX:"PAO_END_SUFFIX",PAONumberRange:"PAONumberRange"},saoFields:{SAO_TEXT:"SAOText",SAO_START_NUMBER:"SAO_START_NUMBER",SAO_START_SUFFIX:"SAO_START_SUFFIX",SAO_END_NUMBER:"SAO_END_NUMBER",SAO_END_SUFFIX:"SAO_END_SUFFIX",SAONumberRange:"SAONumberRange"},constructor:function(){this.inherited(arguments)},_getPAOText:function(a){var b="",d="";return c(a[this.paoFields.PAO_TEXT])===!1&&(b=a[this.paoFields.PAO_TEXT].trim()),d=a[this.paoFields.PAONumberRange].trim(),c(d)===!1&&(b+=d),b.trim()},_getSAOText:function(a){var b="",d="";return c(a[this.saoFields.SAO_TEXT])===!1&&(b=a[this.saoFields.SAO_TEXT].trim()),d=a[this.saoFields.SAONumberRange].trim(),c(d)===!1&&(b+=d),b.trim()},_getListLevelDescription:function(a,b){var c="",d="",e=this.streetFields,f=this.paoFields;switch(a){case 1:d=this._formatDescription([b[e.STREET_DESCRIPTOR],b[e.LOCALITY_NAME],b[e.TOWN_NAME],b[e.ADMINISTRATIVE_AREA]].filter(Boolean).join(", ")),c=[b[f.PAO_TEXT],d].filter(Boolean).join(", ");break;case 2:c=this._formatDescription([b.StreetDescriptor.trim(),b.LocalityName.trim(),b.Town.trim(),b.AdminArea.trim()].filter(Boolean).join(", "))}return c}})});