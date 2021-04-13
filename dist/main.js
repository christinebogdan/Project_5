(()=>{const e=document.getElementById("overview"),t=document.querySelectorAll(".header__nav-ul--li"),a={},n={},r=window.location.href;for(let e=0;e<t.length;e++)t[e].addEventListener("click",l),t[e].addEventListener("keydown",(e=>{"Enter"===e.key&&l(e)}));function l(e){let n;"click"===e.type?n=e.target:"keydown"===e.type&&(n=e.target.firstElementChild);let r=n.getAttribute("data-name");if("inactive"===n.getAttribute("data-state")){t.forEach((e=>{e.setAttribute("data-state","inactive"),e.setAttribute("aria-current","false")})),n.setAttribute("data-state","active"),n.setAttribute("aria-current","true");for(let e of Object.keys(a)){let t=document.getElementById(e);a[e].includes(r)?t.style.display="flex":t.style.display="none"}}else{n.setAttribute("data-state","inactive"),n.removeAttribute("aria-current");for(let e of Object.keys(a))document.getElementById(e).style.display="flex"}}function o(e){let t=document.createElement("ul");t.className="photographer__tags",t.addEventListener("click",l),t.addEventListener("keydown",(e=>{"Enter"===e.key&&l(e)}));for(let a=0;a<e.length;a++){let n=document.createElement("li");"sport"===e[a]?n.textContent="#sports":n.textContent=`#${e[a]}`,n.className="photographer__tag",n.setAttribute("data-name",e[a]),n.setAttribute("data-state","inactive"),n.setAttribute("role","link"),n.setAttribute("tabindex","0");let r=document.createElement("span");r.textContent="Tag",r.className="sr-only",n.appendChild(r),t.appendChild(n)}return t}!async function(){!function(t){for(let r=0;r<t.length;r++){let l=t[r];l.tags.includes("sport")&&l.tags.splice(l.tags.indexOf("sport"),1,"sports"),a[`${l.id}`]=l.tags,n[`${l.id}`]="display";let i=document.createElement("article");i.className="photographer",i.id=`${l.id}`;let s=document.createElement("a");s.className="photographer__link",s.setAttribute("aria-label",l.name),s.href=`./pages/${l.name.replace(/ /g,"_")}_${l.id}.html`;let c=document.createElement("img");s.appendChild(c),c.src=`./img/photographers/ID_Photos/${l.portrait}`,c.setAttribute("alt",""),c.className="photographer__img";let d=document.createElement("h2");d.textContent=l.name,d.className="photographer__name",s.appendChild(d);let p=document.createElement("p");p.textContent=`${l.city}, ${l.country}`,p.className="photographer__location";let m=document.createElement("p");m.textContent=l.tagline,m.className="photographer__tagline";let u=document.createElement("p");u.textContent=`$${l.price}/day`,u.className="photographer__price";let h=o(l.tags);e.appendChild(i),i.appendChild(s),i.appendChild(p),i.appendChild(m),i.appendChild(u),i.appendChild(h)}if(r.includes("?")){const e=r.substring(r.indexOf("?")+1);e&&(document.querySelector(`[data-name=${e}]`).click(),document.querySelector(`[data-name=${e}]`).parentNode.focus())}}(await async function(){try{const e=await fetch("./data.json"),t=(await e.json()).photographers;return console.log(t),t}catch(e){console.error(e)}}())}()})();