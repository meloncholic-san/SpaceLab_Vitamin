import{s as i,H as g}from"./app-YCXN7p87.js";const o=6;async function _({category:r="all",page:a=1}){let t=i.from("products").select("*").order("created_at",{ascending:!1});r!=="all"&&(r==="sale"?t=t.gt("discount",0):t=t.eq("category",r));const e=(a-1)*o,n=e+o-1,{data:c,error:s}=await t.range(e,n);if(s)throw s;return c}async function h(r){const{data:a,error:t}=await i.from("products").select("*").eq("id",r).single();if(t)throw t;return a}async function w({category:r,excludeId:a,limit:t=4}){const{data:e,error:n}=await i.from("products").select("*").eq("category",r).neq("id",a).order("created_at",{ascending:!1}).limit(t-1);if(n)throw n;const{data:c,error:s}=await i.from("products").select("*").gt("discount",0).neq("id",a).limit(1);if(s)throw s;return[...e,...(c??[]).filter(d=>!e.some(p=>p.id===d.id))].slice(0,t)}const u=`<article class="product-card">\r
    <div class="product-card__wrapper">\r
        <a href="/product?id={{id}}" class="product-card__link" style="color: black;">\r
            {{#if discount}}\r
                <span class="product-card__sale">-{{discount}}%</span>\r
            {{/if}}\r
\r
            <img\r
                class="product-card__image"\r
                src="./img/components/products/{{image}}.png"\r
                alt="{{title}}"\r
                loading="lazy"\r
            />\r
\r
            <div class="product-card__content">\r
                <p class="product-card__category {{categoryClass}}">{{category}}</p>\r
                <h3 class="product-card__title">{{title}}</h3>\r
\r
                <div class="product-card__price">\r
                {{#if discount}}\r
                    <span class="product-card__price--old">\${{oldPrice}}</span>\r
                    <span class="product-card__price--new">\${{price}}</span>\r
                {{else}}\r
                    <span class="product-card__price--regular">\${{price}}</span>\r
                {{/if}}\r
                </div>\r
\r
            </div>\r
        </a>\r
    </div>\r
</article>\r
`,l=g.compile(u),f={"Vitamins & Dietary Supplements":"category--vitamins",Minerals:"category--minerals","Pain Relief":"category--pain",Probiotics:"category--probiotics",Antioxidants:"category--antioxidants","Weight Loss":"category--weight-loss","Prenatal Vitamins":"category--prenatal-vitamins"};function P(r,a,{append:t=!1}={}){if(r=r.map(e=>(e.discount&&(e.oldPrice=e.price,e.price=(e.price*(1-e.discount/100)).toFixed(2)),e.categoryClass=f[e.category]||"category--default",e)),r.length<=2?(a.style.marginRight="auto",a.style.marginLeft="auto"):(a.style.marginRight="",a.style.marginLeft=""),r.length===0){a.innerHTML='<p style="font-size=20px color=red">No items!</p>';return}console.log(r),t?a.insertAdjacentHTML("beforeend",r.map(e=>l(e)).join("")):a.innerHTML=r.map(e=>l(e)).join("")}function L(r){return new URLSearchParams(window.location.search).get(r)}function C(r,a){const t=new URL(window.location.href);a==="all"||!a?t.searchParams.delete(r):t.searchParams.set(r,a),history.pushState({},"",t)}export{_ as a,h as b,w as c,L as g,P as r,C as s};
