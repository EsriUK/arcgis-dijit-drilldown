String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}),Array.prototype.filter||(Array.prototype.filter=function(a){"use strict";var b,c,d,e,f,g=0;if(void 0===this||null===this)throw new TypeError;if(b=Object(this),c=b.length>>>0,"function"!=typeof a)throw new TypeError;for(d=[],e=arguments.length>=2?arguments[1]:void 0,g=0;c>g;g++)g in b&&(f=b[g],a.call(e,f,g,b)&&d.push(f));return d}),define(["dojo/_base/declare","esri/tasks/locator","./PickList","./PickListItem","dojo/Deferred"],function(a,b,c,d,e){return a([b],{locatorType:"None",streetGrouping:[],premiseGrouping:[],paoFields:{PAO_TEXT:"",PAO_START_NUMBER:"",PAO_START_SUFFIX:"",PAO_END_NUMBER:"",PAO_END_SUFFIX:""},saoFields:{SAO_TEXT:"",SAO_START_NUMBER:"",SAO_START_SUFFIX:"",SAO_END_NUMBER:"",SAO_END_SUFFIX:""},constructor:function(){},_isNullOrEmpty:function(a){return void 0===a||null===a||""===a},_geocodeHandler:function(a,b,d,e,f){var g=this;try{this.resultsPickList=new c,this._buildPickList(a).then(function(){g._successHandler([g.resultsPickList],"onAddressToLocationsComplete",d,f)})}catch(h){this._errorHandler(h,e,f)}},_descriptionSort:function(a,b){return a.SortDescription.trim().localeCompare(b.SortDescription.trim())},_alphanumSort:function(a,b){function c(a){for(var b,c,d=[],e=0,f=-1,g=0;b=(c=a.charAt(e++)).charCodeAt(0);){var h=46==b||b>=48&&57>=b;h!==g&&(d[++f]="",g=h),d[f]+=c}return d}var d,e,f,g=a.SortDescription,h=b.SortDescription;for(d=c(g),e=c(h),f=0;d[f]&&e[f];f++)if(d[f]!==e[f]){var i=Number(d[f]),j=Number(e[f]);return i==d[f]&&j==e[f]?i-j:d[f]>e[f]?1:-1}return d.length-e.length},_paoSaoNumberRange:function(a,b,c,d){var e=a.trim()+b.trim(),f=c.trim()+d.trim();return this._isNullOrEmpty(e)===!1&&this._isNullOrEmpty(f)===!1?e+"-"+f:e+f},_getGroupedAddressValue:function(a,b){var c,d,e=0,f=a.length,g="",h=[];for(e=0;f>e;e++)c=a[e],d=b[c],d.length>0&&h.push(d);return h.length>0&&(h.reverse(),g=h.join(", ")),g},_buildPickList:function(a){var b,f,g,h,i,j,k,l,m,n=new e,o=0,p=0,q={},r={},s=0,t=0;if(this.resultsPickList=new c,a.candidates.length>0){for(b=a.candidates,o=0,p=b.length;p>o;o++)f=b[o],g=f.attributes,h=this._getGroupedAddressValue(this.streetGrouping,g),h.length>0&&(q.hasOwnProperty(h)?q[h].addCandidate(f):q[h]=new d({SortDescription:g.STREET_DESCRIPTOR,Description:this._getListLevelDescription(2,g),Addresses:[f],Level:2}));for(i in q)if(q.hasOwnProperty(i))if(r={},q[i].Addresses.length>1){for(j=new d({Description:i}),k=q[i].Addresses,s=0,t=k.length;t>s;s++)h=this._getGroupedAddressValue(this.premiseGrouping,k[s].attributes),m=null,h.length>0&&(m=k[s],m.SortDescription=this._getSAOText(k[s].attributes),r.hasOwnProperty(h)?r[h].addCandidate(m):r[h]=new d({SortDescription:this._getPAOText(k[s].attributes),Description:this._getListLevelDescription(1,k[s].attributes),Addresses:[m],Level:1}));for(l in r)r.hasOwnProperty(l)&&(r[l].Addresses.sort(this._alphanumSort),j.addCandidate(r[l]));j.Addresses.sort(this._alphanumSort),this.resultsPickList.addItem(j)}else this.resultsPickList.addItem(q[i]);this.resultsPickList.PickListItems.sort(this._descriptionSort),this.resultsPickList.PickListItems.reverse(),n.resolve()}else n.resolve();return n.promise}})});