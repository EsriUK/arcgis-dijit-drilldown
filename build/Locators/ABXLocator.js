define(["dojo/_base/declare","./_LocatorBase"],function(a,b){return a([b],{locatorType:"ABX",resultsPickList:null,streetGrouping:["STREET_DESCRIPTION","LOCALITY_NAME","TOWN_NAME","ADMINISTRATIVE_AREA"],premiseGrouping:["PAO_TEXT","PAO_END_SUFFIX","PAO_END_NUMBER","PAO_START_SUFFIX","PAO_START_NUMBER"],streetFields:{STREET_DESCRIPTOR:"STREET_DESCRIPTION",LOCALITY_NAME:"LOCALITY_NAME",TOWN_NAME:"TOWN_NAME",ADMINISTRATIVE_AREA:"ADMINISTRATIVE_AREA"},paoFields:{PAO_TEXT:"PAO_TEXT",PAO_START_NUMBER:"PAO_START_NUMBER",PAO_START_SUFFIX:"PAO_START_SUFFIX",PAO_END_NUMBER:"PAO_END_NUMBER",PAO_END_SUFFIX:"PAO_END_SUFFIX"},saoFields:{SAO_TEXT:"SAO_TEXT",SAO_START_NUMBER:"SAO_START_NUMBER",SAO_START_SUFFIX:"SAO_START_SUFFIX",SAO_END_NUMBER:"SAO_END_NUMBER",SAO_END_SUFFIX:"SAO_END_SUFFIX"},constructor:function(){this.inherited(arguments)},_getPAOText:function(a,b){var c="",d="",e=this.paoFields;return _isNullOrEmpty(a[e.PAO_TEXT])!==!1||b||(c=a[e.PAO_TEXT].trim()),d=_paoSaoNumberRange(a[e.PAO_START_NUMBER],a[e.PAO_START_SUFFIX],a[e.PAO_END_NUMBER],a[e.PAO_END_SUFFIX]),_isNullOrEmpty(d)===!1&&(c+=" "+d),c.trim()},_getSAOText:function(a,b){var c="",d="",e=this.saoFields;return _isNullOrEmpty(a[e.SAO_TEXT])!==!1||b||(c=a[e.SAO_TEXT].trim()),d=_paoSaoNumberRange(a[e.SAO_START_NUMBER],a[e.SAO_START_SUFFIX],a[e.SAO_END_NUMBER],a[e.SAO_END_SUFFIX]),_isNullOrEmpty(d)===!1&&(c+=" "+d),c.trim()}})});