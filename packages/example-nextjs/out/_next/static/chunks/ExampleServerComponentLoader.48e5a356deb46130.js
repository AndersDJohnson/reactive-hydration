"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[390,257,771,92,388],{3257:function(a,b,c){c.r(b),c.d(b,{ExampleClientComponent:function(){return j}});var d=c(8530),e=c(2322),f=c(3476),g=c(6302),h=c(5583),i=c(254),j=(0,g.rJ)({name:"ExampleClientComponent",states:"textState,text2State"},function(){var a=(0,d.Z)((0,f.useRecoilState)(h.e),1)[0],b=(0,d.Z)((0,f.useRecoilState)(i.s),1),c=b[0];return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h4",{children:"ExampleClientComponent"}),(0,e.jsxs)("div",{children:["recoil textState = ",a]}),(0,e.jsxs)("div",{children:["recoil text2State = ",c]})]})});j.displayName="ExampleClientComponent"},5771:function(a,b,c){c.r(b),c.d(b,{ExampleClientComponent1:function(){return i}});var d=c(8530),e=c(2322),f=c(3476),g=c(6302),h=c(5583),i=(0,g.rJ)({name:"ExampleClientComponent1",states:"textState"},function(){var a=(0,d.Z)((0,f.useRecoilState)(h.e),1)[0];return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h4",{children:"ExampleClientComponent1"}),(0,e.jsxs)("div",{children:["recoil textState = ",a]})]})});i.displayName="ExampleClientComponent1"},5388:function(a,b,c){c.r(b),c.d(b,{ExampleClientComponent2:function(){return k}});var d=c(8530),e=c(2322),f=c(2784),g=c(3476),h=c(6302),i=c(254),j=h.cQ,k=(0,h.rJ)({name:"ExampleClientComponent2",states:"text2State"},function(){var a=(0,d.Z)((0,g.useRecoilState)(i.s),1)[0],b=(0,d.Z)(j(0),2),c=b[0],h=b[1],k=(0,f.useCallback)(function(){return h(function(a){return a+1})},[]);return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h4",{children:"ExampleClientComponent2"}),(0,e.jsxs)("div",{children:["recoil text2State = ",a]}),(0,e.jsxs)("div",{children:["useState count = ",c]}),(0,e.jsx)("button",{onClick:k,"data-click":!0,children:"count++"})]})});k.displayName="ExampleClientComponent2"},8388:function(a,b,c){c.r(b),c.d(b,{ExampleClientComponentNesting:function(){return l}});var d=c(8530),e=c(2322),f=c(3476),g=c(6302),h=c(5583),i=c(3257),j=c(5771),k=c(5388),l=(0,g.rJ)({name:"ExampleClientComponentNesting",states:"textState"},function(){var a=(0,d.Z)((0,f.useRecoilState)(h.e),1)[0];return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h4",{children:"ExampleClientComponentNesting"}),(0,e.jsxs)("div",{children:["recoil textState = ",a]}),(0,e.jsxs)("div",{style:{paddingLeft:48,paddingTop:12},children:[(0,e.jsx)(i.ExampleClientComponent,{}),(0,e.jsx)(j.ExampleClientComponent1,{}),(0,e.jsx)(k.ExampleClientComponent2,{})]})]})});l.displayName="ExampleClientComponentNesting"},2515:function(a,b,c){c.r(b),c.d(b,{ExampleServerComponent:function(){return i}});var d=c(2322),e=c(3257),f=c(5771),g=c(5388),h=c(8388),i=function(){return console.debug("Rendering ExampleServerComponent (should be on server only on initial page load, but may be loaded on client after routing)"),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(e.ExampleClientComponent,{}),(0,d.jsx)(e.ExampleClientComponent,{}),(0,d.jsx)(f.ExampleClientComponent1,{}),(0,d.jsx)(g.ExampleClientComponent2,{}),(0,d.jsx)(h.ExampleClientComponentNesting,{})]})};i.displayName="ExampleServerComponent"},254:function(a,b,c){c.d(b,{s:function(){return g}});var d=c(3476),e=c(6302),f="(initial value)",g=(0,e.uu)("text2State",(0,d.atom)({key:"text2State",default:f}),f)},5583:function(a,b,c){c.d(b,{e:function(){return g}});var d=c(3476),e=c(6302),f="(initial value)",g=(0,e.uu)("textState",(0,d.atom)({key:"textState",default:f}),f)},8530:function(a,b,c){function d(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function e(a,b){return function(a){if(Array.isArray(a))return a}(a)||function(a){if("undefined"!=typeof Symbol&&null!=a[Symbol.iterator]||null!=a["@@iterator"])return Array.from(a)}(a,b)||function(a,b){if(a){if("string"==typeof a)return d(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);if("Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c)return Array.from(c);if("Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c))return d(a,b)}}(a,b)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}c.d(b,{Z:function(){return e}})}}])