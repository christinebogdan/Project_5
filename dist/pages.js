(()=>{"use strict";const e=function(){this.createMedia=function(e){let t;switch(t="image"in e?"image":"video",t){case"image":return new class{constructor(e){this.element=e}getTitle(e){let t=e.substring(e.indexOf("_")+1);return t=t.replace(/_/g," "),t=t.replace(/.jpg/g,""),t}getSource(e){let t=this.element.image;return t=t.replace(/.jpg/g,""),t}gallery(){const e=document.createElement("div");e.classList.add("gallery__element"),e.setAttribute("data-date",this.element.date),e.setAttribute("data-likes",this.element.likes),e.setAttribute("data-id",this.element.id),e.setAttribute("data-title",this.getTitle(this.element.image));const t=document.createElement("img");t.src=`../img/photographers/${this.element.photographerId}/${this.getSource(this.element.image)}.jpg`,t.alt=`${this.element.alt}, closeup view`,t.classList.add("gallery__mediaItem");const n=document.createElement("div");n.classList.add("gallery__mediaInfo");const a=document.createElement("p");a.textContent=this.getTitle(this.element.image),a.classList.add("gallery__mediaInfo--title");const i=document.createElement("p");i.textContent=this.element.likes,i.classList.add("gallery__mediaInfo--likes");const l=document.createElement("img");l.src="../img/heart-red.svg",l.alt="likes",l.classList.add("gallery__mediaInfo--likesImg");const s=document.createElement("p");return s.textContent=`${this.element.price} $`,s.classList.add("gallery__mediaInfo--price"),n.appendChild(a),n.appendChild(s),n.appendChild(i),n.appendChild(l),e.appendChild(t),e.appendChild(n),e}lightbox(){const e=document.createElement("div");e.classList.add("carousel__item"),e.setAttribute("role","group"),e.setAttribute("aria-roledescription","slide"),e.setAttribute("data-id",this.element.id);const t=document.createElement("img");t.src=`../img/photographers/${this.element.photographerId}/${this.getSource(this.element.image)}.jpg`,t.alt=this.element.alt,t.classList.add("carousel__image");const n=document.createElement("p");return n.textContent=this.getTitle(this.element.image),n.classList.add("carousel__image--title"),e.appendChild(t),e.appendChild(n),e}}(e);case"video":return new class{constructor(e){this.element=e}getTitle(e){let t=e.substring(e.indexOf("_")+1);return t=t.replace(/_/g," "),t=t.replace(/.mp4/g,""),t}getSource(e){let t=e;return t=t.replace(/.mp4/g,""),t}gallery(){const e=document.createElement("div");e.classList.add("gallery__element"),e.setAttribute("data-date",this.element.date),e.setAttribute("data-likes",this.element.likes),e.setAttribute("data-id",this.element.id),e.setAttribute("data-title",this.getTitle(this.element.video));const t=document.createElement("video");t.classList.add("gallery__mediaItem");const n=document.createElement("source");n.src=`../img/photographers/${this.element.photographerId}/${this.getSource(this.element.video)}.mp4`,t.appendChild(n),t.setAttribute("aria-label",`${this.element.alt}, closeup view`);const a=document.createElement("div");a.classList.add("gallery__mediaInfo");const i=document.createElement("p");i.textContent=this.getTitle(this.element.video),i.classList.add("gallery__mediaInfo--title");const l=document.createElement("p");l.textContent=this.element.likes,l.classList.add("gallery__mediaInfo--likes");const s=document.createElement("img");s.src="../img/heart-red.svg",s.alt="likes",s.classList.add("gallery__mediaInfo--likesImg");const r=document.createElement("p");return r.textContent=`${this.element.price} $`,r.classList.add("gallery__mediaInfo--price"),a.appendChild(i),a.appendChild(r),a.appendChild(l),a.appendChild(s),e.appendChild(t),e.appendChild(a),e}lightbox(){const e=document.createElement("div");e.classList.add("carousel__item"),e.setAttribute("role","group"),e.setAttribute("aria-roledescription","slide"),e.setAttribute("data-id",this.element.id);const t=document.createElement("video");t.classList.add("carousel__video"),t.setAttribute("controls","true"),t.setAttribute("aria-label",this.element.alt);const n=document.createElement("source");n.src=`../img/photographers/${this.element.photographerId}/${this.getSource(this.element.video)}.mp4`,t.appendChild(n);const a=document.createElement("p");return a.textContent=this.getTitle(this.element.video),a.classList.add("carousel__image--title"),e.appendChild(t),e.appendChild(a),e}}(e)}}},t=window.location.pathname.split("/")[window.location.pathname.split("/").length-1],n=parseInt(t.replace(/[^0-9]/g,"")),a=(document.querySelector("body"),document.querySelector(".main__article")),i=document.getElementById("filter-button"),l=document.getElementById("listbox"),s=document.getElementById("filter-button-arrow"),r=(document.querySelectorAll("#listbox li"),document.querySelector(".gallery")),o=document.querySelector(".aside"),c=document.querySelector(".modal"),d=document.querySelector(".modal__overlay"),m=document.querySelectorAll("#close, #firstname, #lastname, #email, #message, #submit"),u=m[0],p=m[m.length-1],g=document.querySelector(".modal__close"),h=document.querySelector(".form"),y=(document.querySelector("form__btn"),document.querySelector(".lightbox")),v=document.querySelector(".carousel"),E=document.getElementById("carousel__items"),f=document.querySelector(".carousel__controls--close"),_=document.querySelector(".carousel__controls--right"),b=document.querySelector(".carousel__controls--left"),k=[];let L=0;function C(){const e=i.innerText.toLowerCase(),t=document.querySelector(`#${e}`);t.classList.add("is-active"),s.style.WebkitTransform="rotate(180deg)",i.setAttribute("aria-expanded","true"),l.setAttribute("aria-activedescendant",t.id),l.style.display="block",l.focus()}function A(){l.style.display="none",i.setAttribute("aria-expanded","false"),l.removeAttribute("aria-activedescendant"),s.style.WebkitTransform="rotate(0deg)",i.focus()}function w(e){const t=document.querySelector(".gallery"),n=Array.from(t.children);switch(e){case"popularity":n.sort(x);break;case"date":n.sort(I);break;case"title":n.sort(S)}n.forEach((e=>{t.appendChild(e)}))}function x(e,t){const n=parseInt(e.getAttribute("data-likes"));return parseInt(t.getAttribute("data-likes"))-n}function S(e,t){const n=e.getAttribute("data-title"),a=t.getAttribute("data-title");return n<a?-1:n===a?0:1}function I(e,t){const n=new Date(e.getAttribute("data-date"));return new Date(t.getAttribute("data-date"))-n}function q(){d.style.display="none",document.querySelector(".main__article--btn").focus()}function $(e){const t=e.target.previousElementSibling,n=parseInt(t.textContent),a=document.getElementById("aside__count"),i=parseInt(a.textContent);t.textContent=n+1,a.textContent=i+1}!async function(){const t=await async function(){try{const e=await fetch("../data.json"),t=await e.json();return console.log(t),t}catch(e){console.error(e)}}();let i=t.media;const l=t.photographers;(function(e){for(let t=0;t<e.length;t++){let a=e[t];a.photographerId===n&&(k.push(a),L+=a.likes)}})(i),function(e){let t;for(let a=0;a<e.length;a++)Object.values(e[a]).some((e=>e===n))&&(t=e[a]);const i=document.createElement("div"),l=document.createElement("div");l.classList.add("main__article--wrapper");const s=document.createElement("h1");s.textContent=t.name,s.classList.add("main__article--headline");const r=document.createElement("p");r.textContent=`${t.city}, ${t.country}`,r.classList.add("main__article--location");const c=document.createElement("p");c.textContent=t.tagline,c.classList.add("main__article--tagline");const m=function(e){const t=document.createElement("div");t.className="main__article--tags";for(let n=0;n<e.length;n++){const a=document.createElement("a");a.textContent=`#${e[n]}`,a.className="main__article--tag",a.setAttribute("data-name",e[n]),a.setAttribute("aria-label",`Link to FishEye homepage showing only photographers that match the filter ${e[n]}`),a.href=`../index.html?${e[n]}`;const i=document.createElement("span");i.textContent="Tag",i.className="sr-only",a.appendChild(i),t.appendChild(a)}return t}(t.tags);i.appendChild(s),i.appendChild(r),i.appendChild(c),i.appendChild(m);const p=document.createElement("button");p.textContent="Contact me",p.classList.add("main__article--btn"),p.addEventListener("click",(e=>{e.stopPropagation(),d.style.display="flex",u.focus()})),l.appendChild(i),l.appendChild(p);const g=document.createElement("img");g.src=`../img/photographers/ID_Photos/${t.portrait}`,g.alt="",g.classList.add("main__article--img"),a.appendChild(l),a.appendChild(g);const h=document.createElement("div");h.classList.add("aside__wrapper");const y=document.createElement("span");y.id="aside__count",y.textContent=L;const v=document.createElement("img");v.src="../img/heart-black.svg",v.classList.add("aside__heart");const E=document.createElement("span");E.classList.add("aside__price"),E.textContent=`${t.price}$ / Day`,o.appendChild(h),h.appendChild(y),h.appendChild(v),h.appendChild(E)}(l),function(t){t.forEach((t=>r.appendChild(function(t){const n=(new e).createMedia(t).gallery();return n.firstElementChild.setAttribute("tabindex","0"),n.firstElementChild.addEventListener("click",(e=>{e.stopPropagation(),T(e)})),n.firstElementChild.addEventListener("keydown",(e=>{"Enter"!==e.key&&" "!==e.key||T(e)})),n}(t))));const n=document.getElementsByClassName("gallery__mediaInfo--likesImg");for(let e=0;e<n.length;e++)n[e].addEventListener("click",(e=>{e.stopPropagation(),$(e)}));if(t.length%3!=0){let e=document.createElement("div");e.classList.add("gallery__placeholder"),e.setAttribute("data-date","1900-01-01"),e.setAttribute("data-title","zzz"),e.setAttribute("data-likes","0"),r.appendChild(e)}}(k),w("popularity"),function(t){console.log(t),t.forEach((t=>{var n;E.appendChild((n=t,(new e).createMedia(n).lightbox()))}))}(k)}(),i.addEventListener("click",(e=>{e.stopPropagation(),C()})),i.addEventListener("keydown",(e=>{document.activeElement===i&&("ArrowDown"!==e.key&&"ArrowUp"!==e.key&&"Enter"!==e.key||(e.preventDefault(),C()))})),l.addEventListener("click",(e=>{e.stopPropagation();const t=document.querySelector(".is-active"),n=e.target;t.classList.remove("is-active"),n.classList.add("is-active"),l.setAttribute("aria-activedescendant",n.id);let a=document.querySelector(".is-active").innerText;i.textContent=a,A(),w(a.toLowerCase())})),l.addEventListener("keydown",(e=>{e.preventDefault();const t=document.querySelector(".is-active");let n;if(document.activeElement===l)switch(e.key){case"Home":n=l.firstElementChild;break;case"End":n=l.lastElementChild;break;case"ArrowDown":n=t.nextElementSibling,null===n&&(n=l.firstElementChild);break;case"ArrowUp":n=t.previousElementSibling,null===n&&(n=l.lastElementChild);break;case"Enter":n=document.querySelector(".is-active"),i.textContent=n.innerText,A(),w(n.innerText.toLowerCase());break;case"Escape":for(let e=0;e<document.querySelector("#listbox").children.length;e++)document.querySelector("#listbox").children[e].classList.remove("is-active");return void A()}t.classList.remove("is-active"),n.classList.add("is-active"),t.setAttribute("aria-selected","false"),n.setAttribute("aria-selected","true"),l.setAttribute("aria-activedescendant",n.id)})),document.querySelector(".main").addEventListener("click",A),c.addEventListener("keydown",(e=>{e.stopPropagation(),"Escape"===e.key&&q()})),d.addEventListener("click",(e=>{e.stopPropagation(),e.target===d&&q()})),g.addEventListener("click",(e=>{e.stopPropagation(),q()})),g.addEventListener("keydown",(e=>{e.target!==g||" "!==e.key&&"Enter"!==e.key||(e.preventDefault(),q())})),c.addEventListener("keydown",(e=>{"Tab"===e.key&&(e.shiftKey?document.activeElement===u?(e.preventDefault(),p.focus()):document.activeElement===m[1]&&(e.preventDefault(),u.focus()):document.activeElement===p&&(e.preventDefault(),u.focus()))})),h.addEventListener("submit",(e=>{e.preventDefault(),e.stopPropagation(),console.log(`First name: ${firstname.value}, Last name: ${lastname.value}, Email: ${email.value}, Message: ${message.value}`),q()}));const D=Array.from(document.getElementsByClassName("carousel__controls"));function T(e){const t=document.activeElement;let n,a=document.querySelector(".gallery").firstElementChild;n=document.querySelector(".gallery").lastElementChild.classList.contains("gallery__placeholder")?document.querySelector(".gallery").lastElementChild.previousElementSibling:document.querySelector(".gallery").lastElementChild;const i=Array.from(document.querySelectorAll(".carousel__item")),l=e.target;let s=l.parentElement,r=l.parentElement.getAttribute("data-id"),o=i.find((e=>e.getAttribute("data-id")===r));function c(e){"Enter"!==e.key&&" "!==e.key||d()}function d(e){o.classList.remove("active"),s=s===n?a:s.nextElementSibling,r=s.getAttribute("data-id"),o=i.find((e=>e.getAttribute("data-id")===r)),o.classList.add("active")}function m(e){"Enter"!==e.key&&" "!==e.key||u()}function u(e){o.classList.remove("active"),s=s===a?n:s.previousElementSibling,r=s.getAttribute("data-id"),o=i.find((e=>e.getAttribute("data-id")===r)),o.classList.add("active")}function p(e){"Escape"===e.key?(e.preventDefault(),g()):"ArrowRight"===e.key?(e.preventDefault(),d()):"ArrowLeft"===e.key&&(e.preventDefault(),u())}function g(){y.style.display="none",i.forEach((e=>{e.classList.remove("active")})),t.focus(),v.removeEventListener("keydown",p),_.removeEventListener("click",d),_.removeEventListener("keydown",c),b.removeEventListener("click",u),b.removeEventListener("keydown",m)}y.style.display="flex",o.classList.add("active"),_.addEventListener("click",d),_.addEventListener("keydown",c),b.addEventListener("click",u),b.addEventListener("keydown",m),f.focus(),v.addEventListener("keydown",p),f.addEventListener("click",(()=>{g()})),f.addEventListener("keydown",(e=>{"Enter"!==e.key&&" "!==e.key||(e.stopPropagation(),e.preventDefault(),g())}))}v.addEventListener("keydown",(e=>{const t=D[0],n=D[D.length-1];document.activeElement===t?e.shiftKey&&"Tab"===e.key&&(e.preventDefault(),n.focus()):document.activeElement===n&&("Tab"!==e.key||e.shiftKey||(e.preventDefault(),t.focus()))}))})();