Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d?this:a,b.concat(Array.prototype.slice.call(arguments)))};return this.prototype&&(d.prototype=this.prototype),e.prototype=new d,e}),define(["dojo/_base/declare","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","esri/dijit/Search","dojo/dom-construct","dijit/layout/ContentPane","dijit/TitlePane","dojox/widget/TitleGroup","dojo/on","dojo/Deferred","dojo/query","dojo/NodeList-data"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m=function(a){return void 0===a||null===a||""===a},n=function(a,b){var c=f.toDom("<span class='drilldownResult'>"+a+"</span>");return l(c).data("result",b),c},o=function(a,b){var c=0,d=0,e=new i,f=a.Addresses;for(c=0,d=f.length;d>c;c+=1)e.addChild(new g({content:n(f[c].address,f[c])}));b.addChild(new h({title:a.Description,content:e,open:!1}))};return a([b,c,d,e],{baseClass:"drilldown",widgetsInTemplate:!0,resultsElement:null,_titleGroups:[],_resultsStore:null,constructor:function(b){a.safeMixin(this,b)},destroy:function(){this._clearPicklist(),this.inherited(arguments)},search:function(){var a=this,b=new k;return this.inherited(arguments).then(function(c){a._buildPickListUi(c),b.resolve()}),b.promise},clear:function(){this._clearPicklist(),this.inherited(arguments)},_hydrateResults:function(a){return a.PickListItems?a:this.inherited(arguments)},_formatResults:function(a,b,c){var d={activeSourceIndex:b,value:c,numResults:0,numErrors:0,errors:null,results:null},e={},f={},g=0;if(a){if(b===this._allIndex){for(g=0;g<a.length;g++)m(this.sources[g].locator.locatorType)?d=this.inherited(arguments):(f[b]=a[0],d.numResults+=a[0].PickListItems.length);return d.results=f,d.err=e,d}return m(this.activeSource.locator.locatorType)?this.inherited(arguments):(f[b]=a[0],d.numResults+=a[0].PickListItems.length,d.results=f,d.err=e,d)}return d},_clearPicklist:function(){var a,b;if(this._titleGroups.length>0){for(a=0,b=this._titleGroups.length;b>a;a++)this._titleGroups[a].destroy();this._titleGroups=[]}},_showNoResults:function(){this._noResults(this.value),this._showNoResultsMenu()},_isSingleResult:function(a){var b,c,d,e=0;for(d in a)a.hasOwnProperty(d)&&(e++,c=d);if(1===e){if(b=a[c].PickListItems,1===b.length&&1===b[0].Addresses.length){if(m(b[0].Addresses[0].Addresses))return!0;if(!m(b[0].Addresses[0].Addresses)&&1===b[0].Addresses[0].Addresses.length)return!0}return!1}return!1},_buildPickListUi:function(a){var b,c,d,e,g,n,o=this,p=0,q=0,r=!1,s=this._createGroup,t=new k,u=function(a){this.get("contentSet")===!1&&(this.set("content",s(a)),this.set("contentSet",!0))};if(this._clearPicklist(),f.destroy(this.resultsElement),this.resultsElement=f.create("div",{"class":"arcgisSearch searchGroup picklistResults"},this.domNode,"last"),o.activeSourceIndex!==this._allIndex&&this._isSingleResult(a))e=this._hydrateResult(a[0].PickListItems[0].Addresses[0],o.activeSourceIndex,!1),this.select(e);else{if(!m(a)){for(d in a)if(a.hasOwnProperty(d))if(m(a[d])||m(a[d].PickListItems))r=!0;else if(b=a[d].PickListItems,q=b.length,q>0)for(g=f.create("div",{id:d},this.resultsElement,"last"),c=new i(null,g),c.startup(),this._titleGroups.push(c),p=0;q>p;p+=1)n=new h({title:b[p].Description,open:!1,contentSet:!1}),1===q?(n.set("open",!0),n.set("contentSet",!0),n.set("content",s(b[p]))):n.own(n.on("click",u.bind(n,b[p]))),c.addChild(n),r=!1;else r=!0;t.resolve()}r&&this._showNoResults(),m(this.resultsElement)||j(this.resultsElement,".drilldownResult:click",function(){var a=l(this).data()[0],b=o._hydrateResult(a.result,o.activeSourceIndex,!1);o.select(b)})}return t.promise},_createGroup:function(a){var b,c,d=0,e=0,f=new i;if(!m(a.Addresses)&&a.Addresses.length>1){for(b=a.Addresses,d=0,e=b.length;e>d;d++)!m(b[d].Addresses)&&b[d].Addresses.length>1?o(b[d],f):(c=m(b[d].address)?n(b[d].Addresses[0].address,b[d].Addresses[0]):n(b[d].address,b[d]),f.addChild(new g({content:c})));f.startup()}else m(a.Addresses[0].address)?!m(a.Addresses[0].Addresses)&&a.Addresses[0].Addresses.length>0&&o(a.Addresses[0],f):f=new g({content:n(a.Addresses[0].address,a.Addresses[0])});return f}})});