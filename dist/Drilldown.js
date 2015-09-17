define(["dojo/_base/declare","dojo/_base/lang","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","esri/dijit/Search","dojo/dom-construct","dijit/layout/ContentPane","dijit/TitlePane","dojox/widget/TitleGroup","dojo/on","dojo/Deferred","dojo/query","dojo/NodeList-data"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){return a([c,d,e,f],{baseClass:"drilldown",widgetsInTemplate:!0,resultsElement:null,_titleGroups:[],constructor:function(b){a.safeMixin(this,b)},destroy:function(){this._clearPicklist(),this.inherited(arguments)},search:function(){var a=this,b=new l;return this.inherited(arguments).then(function(b){a._buildPickListUi(b)}),b.promise},clear:function(){this._clearPicklist(),this.inherited(arguments)},_hydrateResults:function(a){return a.PickListItems?a:this.inherited(arguments)},_isNullOrEmpty:function(a){return void 0===a||null===a||""===a},_formatResults:function(a,b,c){var d={activeSourceIndex:b,value:c,numResults:0,numErrors:0,errors:null,results:null},e={},f={},g=0;if(a){if(b===this._allIndex){for(g=0;g<a.length;g++)this._isNullOrEmpty(this.sources[g].locator.locatorType)?d=this.inherited(arguments):(f[b]=a[0],d.numResults+=a[0].PickListItems.length);return d.results=f,d.err=e,d}return this._isNullOrEmpty(this.activeSource.locator.locatorType)?this.inherited(arguments):(f[b]=a[0],d.numResults+=a[0].PickListItems.length,d.results=f,d.err=e,d)}return d},_clearPicklist:function(){var a,b;if(this._titleGroups.length>0){for(a=0,b=this._titleGroups.length;b>a;a++)this._titleGroups[a].destroy();this._titleGroups=[]}},_showNoResults:function(){this._noResults(this.value),this._showNoResultsMenu()},_isSingleResult:function(a){var b,c,d,e=0;for(d in a)a.hasOwnProperty(d)&&(e++,c=d);if(1===e){if(b=a[c].PickListItems,1===b.length&&1===b[0].Addresses.length){if(this._isNullOrEmpty(b[0].Addresses[0].Addresses))return!0;if(!this._isNullOrEmpty(b[0].Addresses[0].Addresses)&&1===b[0].Addresses[0].Addresses.length)return!0}return!1}return!1},_buildPickListUi:function(a){var b,c,d,e,f,h,l,n,o=this,p=0,q=0,r=!1;if(this._clearPicklist(),g.destroy(this.resultsElement),this.resultsElement=g.create("div",{"class":"arcgisSearch searchGroup picklistResults"},this.domNode,"last"),o.activeSourceIndex!==this._allIndex&&this._isSingleResult(a))h=this._hydrateResult(a[0].PickListItems[0].Addresses[0],o.activeSourceIndex,!1),this.select(h);else{if(!this._isNullOrEmpty(a))for(f in a)if(a.hasOwnProperty(f))if(this._isNullOrEmpty(a[f])||this._isNullOrEmpty(a[f].PickListItems))r=!0;else if(b=a[f].PickListItems,q=b.length,q>0)for(l=g.create("div",{id:f},this.resultsElement,"last"),c=new j(null,l),this._titleGroups.push(c),p=0;q>p;p++)d=[],e=this._createGroup(b[p]),n=new i({title:b[p].Description,content:e,open:1===q?!0:!1}),n.startup(),c.startup(),c.addChild(n),r=!1;else r=!0;r&&this._showNoResults(),this._isNullOrEmpty(this.resultsElement)||k(this.resultsElement,".drilldownResult:click",function(){var a=m(this).data()[0],b=o._hydrateResult(a.result,o.activeSourceIndex,!1);o.select(b)})}},_createSubGroup:function(a,b){var c,d=0,e=0,f=new j,k=a.Addresses;for(d=0,e=k.length;e>d;d++)c=g.toDom("<span class='drilldownResult'>"+k[d].address+"</span>"),m(c).data("result",k[d]),f.addChild(new h({content:c}));f.startup(),b.addChild(new i({title:a.Description,content:f,open:!1}))},_createGroup:function(a){var b,c,d=this,e=0,f=0,i=new j;if(!this._isNullOrEmpty(a.Addresses)&&a.Addresses.length>1){for(b=a.Addresses,e=0,f=b.length;f>e;e++)!this._isNullOrEmpty(b[e].Addresses)&&b[e].Addresses.length>1?d._createSubGroup(b[e],i):(this._isNullOrEmpty(b[e].address)?(c=g.toDom("<span class='drilldownResult'>"+b[e].Addresses[0].address+"</span>"),m(c).data("result",b[e].Addresses[0])):(c=g.toDom("<span class='drilldownResult'>"+b[e].address+"</span>"),m(c).data("result",b[e])),i.addChild(new h({content:c})));i.startup()}else this._isNullOrEmpty(a.Addresses[0].address)?!this._isNullOrEmpty(a.Addresses[0].Addresses)&&a.Addresses[0].Addresses.length>0&&(d._createSubGroup(a.Addresses[0],i),i.startup()):(c=g.toDom("<span class='drilldownResult'>"+a.Addresses[0].address+"</span>"),m(c).data("result",a.Addresses[0]),i=new h({content:c}));return i}})});