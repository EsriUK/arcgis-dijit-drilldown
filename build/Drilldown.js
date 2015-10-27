Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d?this:a,b.concat(Array.prototype.slice.call(arguments)))};return this.prototype&&(d.prototype=this.prototype),e.prototype=new d,e}),define(["dojo/_base/declare","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","esri/dijit/Search","dojo/dom-construct","dijit/layout/ContentPane","dijit/TitlePane","dojox/widget/TitleGroup","dojo/on","dojo/Deferred","dojo/query","dojo/dom-style","dojo/NodeList-data"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=function(a){return void 0===a||null===a||""===a},o=function(a,b){var c=f.toDom("<span class='drilldownResult'>"+a+"</span>");return l(c).data("result",b),c},p=function(a,b){return!n(a)&&a.length>0&&b?"<span class='drilldownCount'>"+a.length+"</span>":""},q=function(a,b,c){var d=0,e=0,f=new i,j=a.Addresses;for(d=0,e=j.length;e>d;d+=1)f.addChild(new g({content:["<span class='drilldownResultIcon'></span>",o(j[d].address,j[d])]}));b.addChild(new h({title:p(j,c)+"<span class='drilldownTitle'>"+a.Description+"</span>",content:f,open:!1}))},r=function(a,b){var c,d,e=0,f=0,h=new i;if(!n(a.Addresses)&&a.Addresses.length>1){for(c=a.Addresses,e=0,f=c.length;f>e;e++)!n(c[e].Addresses)&&c[e].Addresses.length>1?q(c[e],h,b):(d=n(c[e].address)?o(c[e].Addresses[0].address,c[e].Addresses[0]):o(c[e].address,c[e]),h.addChild(new g({content:["<span class='drilldownResultIcon'></span>",d]})));h.startup()}else n(a.Addresses[0].address)?!n(a.Addresses[0].Addresses)&&a.Addresses[0].Addresses.length>0&&q(a.Addresses[0],h):h=new g({content:o(a.Addresses[0].address,a.Addresses[0])});return h},s=function(a,b){this.get("contentSet")===!1&&(this.set("content",r(a,b)),this.set("contentSet",!0))};return a([b,c,d,e],{baseClass:"drilldown",widgetsInTemplate:!0,resultsElement:null,_titleGroups:[],showCounts:!1,constructor:function(b){a.safeMixin(this,b)},destroy:function(){this._clearPicklist(),this.inherited(arguments)},search:function(){var a=this,b=new k;return this.inherited(arguments).then(function(c){a._buildPickListUi(c),b.resolve()}),b.promise},clear:function(){this._clearPicklist(),this.inherited(arguments)},_hydrateResults:function(a){return a.PickListItems?a:this.inherited(arguments)},_formatResults:function(a,b,c){var d={activeSourceIndex:b,value:c,numResults:0,numErrors:0,errors:null,results:null},e={},f={},g=0;if(a){if(b===this._allIndex){for(g=0;g<a.length;g++)n(this.sources[g].locator.locatorType)?d=this.inherited(arguments):(f[b]=a[0],d.numResults+=a[0].PickListItems.length);return d.results=f,d.err=e,d}return n(this.activeSource.locator.locatorType)?this.inherited(arguments):(f[b]=a[0],d.numResults+=a[0].PickListItems.length,d.results=f,d.err=e,d)}return d},_clearPicklist:function(){var a,b;if(this._titleGroups.length>0){for(a=0,b=this._titleGroups.length;b>a;a++)this._titleGroups[a].destroy();this._titleGroups=[],m.set(this.resultsElement,"height",0)}},_showNoResults:function(){this._noResults(this.value),this._showNoResultsMenu()},_isSingleResult:function(a){var b,c,d,e=0;for(d in a)a.hasOwnProperty(d)&&(e++,c=d);if(1===e){if(b=a[c].PickListItems,1===b.length&&1===b[0].Addresses.length){if(n(b[0].Addresses[0].Addresses))return!0;if(!n(b[0].Addresses[0].Addresses)&&1===b[0].Addresses[0].Addresses.length)return!0}return!1}return!1},_buildPickListUi:function(a){var b,c,d,e,g,m,o=this,q=0,t=0,u=!1,v=new k;if(this._clearPicklist(),f.destroy(this.resultsElement),this.resultsElement=f.create("div",{"class":"arcgisSearch searchGroup picklistResults"},this.domNode,"last"),o.activeSourceIndex!==this._allIndex&&this._isSingleResult(a))e=this._hydrateResult(a[o.activeSourceIndex].PickListItems[0].Addresses[0],o.activeSourceIndex,!1),this.select(e);else{if(!n(a)){for(d in a)if(a.hasOwnProperty(d))if(n(a[d])||n(a[d].PickListItems))u=!0;else if(b=a[d].PickListItems,t=b.length,t>0)for(g=f.create("div",{id:d},this.resultsElement,"last"),c=new i(null,g),this._titleGroups.push(c),q=0;t>q;q+=1)m=new h({title:p(b[q].Addresses,this.showCounts)+"<span class='drilldownTitle'>"+b[q].Description+"</span>",open:!1,contentSet:!1}),1===t?(m.set("open",!0),m.set("contentSet",!0),m.set("content",r(b[q],this.showCounts))):m.own(m.on("click",s.bind(m,b[q],this.showCounts))),c.addChild(m),u=!1;else u=!0;v.resolve()}u&&this._showNoResults(),n(this.resultsElement)||j(this.resultsElement,".drilldownResult:click",function(){var a=l(this).data()[0],b=o._hydrateResult(a.result,o.activeSourceIndex,!1);o.select(b),o._clearPicklist()})}return v.promise}})});