import{r as c,j as o,f as v}from"./index-BORPp1PP.js";function g(e){var t,s,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var a=e.length;for(t=0;t<a;t++)e[t]&&(s=g(e[t]))&&(r&&(r+=" "),r+=s)}else for(s in e)e[s]&&(r&&(r+=" "),r+=s);return r}function h(){for(var e,t,s=0,r="",a=arguments.length;s<a;s++)(e=arguments[s])&&(t=g(e))&&(r&&(r+=" "),r+=t);return r}const i={primary:"primary",secondary:"secondary",warning:"warning"};function B(e){const{theme:t=i.primary}=e,[s,r]=c.useState(!1),[a,n]=c.useState(!1),[m,l]=c.useState(!1),d=()=>{n(!0)},u=()=>{n(!1)};return o.jsxs("button",{onMouseDown:d,onMouseUp:u,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),onFocus:()=>l(!0),onBlur:()=>l(!1),onTouchStart:d,onTouchEnd:u,type:e.type||"button",disabled:e.disabled||e.isLoading,onClick:e.onClick,title:e.hint,className:h(["flex relative justify-center rounded cursor-pointer disabled:cursor-not-allowed p-2 shadow",e.isLoading&&"cursor-wait disabled:cursor-wait",t===i.primary&&"bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300",t===i.secondary&&"bg-white hover:bg-blue-100 active:bg-blue-200 disable",t===i.warning&&"bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300",e.className]),children:[o.jsx("div",{className:h(["absolute rounded w-full h-full top-0 left-0",t===i.secondary&&"border border-gray-200"])}),o.jsx("div",{className:"relative grow flex items-center justify-center",children:e.label||e.children||e.contentBuilder?.({isHovered:s,isPressed:a,isFocused:m,textColor:getComputedStyle(document.documentElement).getPropertyValue("--text-gray-800")})||"Button"})]})}/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),C=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,s,r)=>r?r.toUpperCase():s.toLowerCase()),f=e=>{const t=C(e);return t.charAt(0).toUpperCase()+t.slice(1)},b=(...e)=>e.filter((t,s,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===s).join(" ").trim(),p=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var j={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=c.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:s=2,absoluteStrokeWidth:r,className:a="",children:n,iconNode:m,...l},d)=>c.createElement("svg",{ref:d,...j,width:t,height:t,stroke:e,strokeWidth:r?Number(s)*24/Number(t):s,className:b("lucide",a),...!n&&!p(l)&&{"aria-hidden":"true"},...l},[...m.map(([u,x])=>c.createElement(u,x)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(e,t)=>{const s=c.forwardRef(({className:r,...a},n)=>c.createElement(k,{ref:n,iconNode:t,className:b(`lucide-${w(f(e))}`,`lucide-${e}`,r),...a}));return s.displayName=f(e),s};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],S=y("circle-check",N);/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],E=y("circle-x",A);function L(e){const t=v();return o.jsx("div",{className:"min-h-full p-3 bg-gradient-to-tr from-purple-300 to-blue-300 overflow-auto",children:o.jsx("div",{className:"grid min-h-full md:place-content-center content-center",children:o.jsxs("div",{className:h(["flex flex-col gap-2 md:min-w-3xl",e.contentWrapperClassName]),children:[o.jsx("p",{title:"Some changes are unsaved",className:"self-end",children:t.hasUnsavedChanges?o.jsx(E,{className:" text-red-600 fill-white"}):o.jsx(S,{className:"text-green-600 fill-white"})}),e.children]})})})}export{B,L as P,i as a,h as b,y as c};
