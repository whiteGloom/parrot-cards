import{r as o,j as n,f as p}from"./index-BBlGBWHT.js";function x(e){var t,r,a="";if(typeof e=="string"||typeof e=="number")a+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(t=0;t<s;t++)e[t]&&(r=x(e[t]))&&(a&&(a+=" "),a+=r)}else for(r in e)e[r]&&(a&&(a+=" "),a+=r);return a}function h(){for(var e,t,r=0,a="",s=arguments.length;r<s;r++)(e=arguments[r])&&(t=x(e))&&(a&&(a+=" "),a+=t);return a}const c={primary:"primary",secondary:"secondary",warning:"warning",transparentWarning:"transparent-warning"},f={extraSmall:"extra-small",medium:"medium"};function U(e){const t=e.size||f.medium,{theme:r=c.primary}=e,[a,s]=o.useState(!1),[l,i]=o.useState(!1),[d,u]=o.useState(!1),m=()=>{i(!0)},g=()=>{i(!1)},w=o.useMemo(()=>{const C=r===c.transparentWarning?"color-red-500":"color-gray-800";return getComputedStyle(document.documentElement).getPropertyValue("--"+C)},[r]);return n.jsxs("button",{onMouseDown:m,onMouseUp:g,onMouseEnter:()=>s(!0),onMouseLeave:()=>s(!1),onFocus:()=>u(!0),onBlur:()=>u(!1),onTouchStart:m,onTouchEnd:g,type:e.type||"button",disabled:e.disabled||e.isLoading,onClick:e.onClick,title:e.hint,className:h(["flex relative justify-center rounded cursor-pointer disabled:cursor-not-allowed shadow",e.isLoading&&"cursor-wait disabled:cursor-wait",t===f.extraSmall&&"p-0.5",t===f.medium&&"p-2",r===c.primary&&"bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300",r===c.secondary&&"bg-white hover:bg-blue-100 active:bg-blue-200 disable",r===c.warning&&"bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300",r===c.transparentWarning&&"text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300",e.className]),children:[n.jsx("div",{className:h(["absolute rounded w-full h-full top-0 left-0",r===c.secondary&&"border border-gray-200"])}),n.jsx("div",{className:h(["relative grow flex items-center justify-center",e.contentWrapperClassName]),children:e.label||e.children||e.contentBuilder?.({isHovered:a,isPressed:l,isFocused:d,textColor:w})||"Button"})]})}/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),N=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,a)=>a?a.toUpperCase():r.toLowerCase()),b=e=>{const t=N(e);return t.charAt(0).toUpperCase()+t.slice(1)},y=(...e)=>e.filter((t,r,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===r).join(" ").trim(),k=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var S={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=o.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:a,className:s="",children:l,iconNode:i,...d},u)=>o.createElement("svg",{ref:u,...S,width:t,height:t,stroke:e,strokeWidth:a?Number(r)*24/Number(t):r,className:y("lucide",s),...!l&&!k(d)&&{"aria-hidden":"true"},...d},[...i.map(([m,g])=>o.createElement(m,g)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=(e,t)=>{const r=o.forwardRef(({className:a,...s},l)=>o.createElement(A,{ref:l,iconNode:t,className:y(`lucide-${j(b(e))}`,`lucide-${e}`,a),...s}));return r.displayName=b(e),r};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],E=v("circle-check",B);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],L=v("circle-x",P);function z(e){const t=p();return n.jsx("div",{className:"min-h-full p-3 bg-gradient-to-tr from-purple-300 to-blue-300 overflow-auto",children:n.jsx("div",{className:"grid min-h-full md:place-content-center content-center",children:n.jsxs("div",{className:h(["flex flex-col gap-2 md:min-w-3xl",e.contentWrapperClassName]),children:[n.jsx("p",{title:t.hasUnsavedChanges?"Some changes are unsaved":"All changes are saved",className:"self-end",children:t.hasUnsavedChanges?n.jsx(L,{className:" text-red-600 fill-white"}):n.jsx(E,{className:"text-green-600 fill-white"})}),e.children]})})})}export{U as B,z as P,c as a,h as b,v as c,f as d};
