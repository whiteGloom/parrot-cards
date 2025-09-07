import{r as n,j as l}from"./index-Be9N7zuG.js";function g(e){var t,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(t=0;t<s;t++)e[t]&&(o=g(e[t]))&&(r&&(r+=" "),r+=o)}else for(o in e)e[o]&&(r&&(r+=" "),r+=o);return r}function f(){for(var e,t,o=0,r="",s=arguments.length;o<s;o++)(e=arguments[o])&&(t=g(e))&&(r&&(r+=" "),r+=t);return r}const c={primary:"primary",secondary:"secondary",warning:"warning"};function A(e){const{theme:t=c.primary}=e,[o,r]=n.useState(!1),[s,a]=n.useState(!1),[m,i]=n.useState(!1),u=()=>{a(!0)},d=()=>{a(!1)};return l.jsxs("button",{onMouseDown:u,onMouseUp:d,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),onFocus:()=>i(!0),onBlur:()=>i(!1),onTouchStart:u,onTouchEnd:d,type:e.type||"button",disabled:e.disabled||e.isLoading,onClick:e.onClick,title:e.hint,className:f(["flex relative justify-center rounded cursor-pointer disabled:cursor-not-allowed p-2 shadow",e.isLoading&&"cursor-wait disabled:cursor-wait",t===c.primary&&"bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300",t===c.secondary&&"bg-white hover:bg-blue-100 active:bg-blue-200 disable",t===c.warning&&"bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300",e.className]),children:[l.jsx("div",{className:f(["absolute rounded w-full h-full top-0 left-0",t===c.secondary&&"border border-gray-200"])}),l.jsx("div",{className:"relative grow flex items-center justify-center",children:e.label||e.children||e.contentBuilder?.({isHovered:o,isPressed:s,isFocused:m,textColor:getComputedStyle(document.documentElement).getPropertyValue("--text-gray-800")})||"Button"})]})}function E(e){return l.jsx("div",{className:"min-h-full p-3 bg-gradient-to-tr from-purple-300 to-blue-300 overflow-auto",children:l.jsx("div",{className:"grid min-h-full min-w-3xl place-content-center",children:l.jsx("div",{className:f(["flex flex-col gap-4 md:min-w-3xl min-w-full",e.contentWrapperClassName]),children:e.children})})})}/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),v=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,r)=>r?r.toUpperCase():o.toLowerCase()),b=e=>{const t=v(e);return t.charAt(0).toUpperCase()+t.slice(1)},h=(...e)=>e.filter((t,o,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===o).join(" ").trim(),x=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var p={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=n.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:o=2,absoluteStrokeWidth:r,className:s="",children:a,iconNode:m,...i},u)=>n.createElement("svg",{ref:u,...p,width:t,height:t,stroke:e,strokeWidth:r?Number(o)*24/Number(t):o,className:h("lucide",s),...!a&&!x(i)&&{"aria-hidden":"true"},...i},[...m.map(([d,w])=>n.createElement(d,w)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=(e,t)=>{const o=n.forwardRef(({className:r,...s},a)=>n.createElement(C,{ref:a,iconNode:t,className:h(`lucide-${y(b(e))}`,`lucide-${e}`,r),...s}));return o.displayName=b(e),o};export{A as B,E as P,c as a,f as b,N as c};
