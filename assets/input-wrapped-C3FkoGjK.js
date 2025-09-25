import{c as n}from"./page-content-wrapper-CMnHi2oT.js";import{o as s,n as t}from"./schemas-DBNbPpsj.js";import{j as a}from"./index-BBlGBWHT.js";/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],x=n("check",i);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],f=n("square-pen",l);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],b=n("trash",c);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],g=n("x",o);s({angle:t(),saturation:t(),lightness:t(),alpha:t().optional()});function y(e){return`hsl(${e.angle}, ${e.saturation}%, ${e.lightness}%)`}function d(e){return a.jsxs("label",{className:"flex flex-col gap-1",htmlFor:e.id,children:[a.jsxs("p",{children:[e.label+" ",e.isRequired&&a.jsx("span",{className:"text-red-600",children:"*"})]}),e.children,!!e.error&&a.jsx("p",{className:"text-red-600",children:e.error})]})}function j(e){return a.jsx(d,{label:e.label,isRequired:e.isRequired,id:e.name,error:e.error,children:a.jsx("input",{onChange:r=>{e.onChange(r)},ref:e.inputRef,autoFocus:e.autofocus||!1,name:e.name,id:e.name,value:e.value,type:e.type||"text",className:"border p-1 rounded border-gray-400 shadow bg-white"})})}export{x as C,j as I,f as S,b as T,g as X,d as a,y as h};
