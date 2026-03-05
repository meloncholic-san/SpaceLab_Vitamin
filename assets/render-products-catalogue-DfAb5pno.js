import{e as n,H as g}from"./app-DWMtlqGX.js";const o=6;async function y({category:t="all",page:a=1}){let e=n.from("products").select("*").order("created_at",{ascending:!1});t!=="all"&&(t==="sale"?e=e.gt("discount",0):e=e.eq("category",t));const r=(a-1)*o,i=r+o-1,{data:c,error:s}=await e.range(r,i);if(s)throw s;return c}async function h(t){const{data:a,error:e}=await n.from("products").select("*").eq("id",t).single();if(e)throw e;return a}async function w({category:t,excludeId:a,limit:e=4}){const{data:r,error:i}=await n.from("products").select("*").eq("category",t).neq("id",a).order("created_at",{ascending:!1}).limit(e-1);if(i)throw i;const{data:c,error:s}=await n.from("products").select("*").gt("discount",0).neq("id",a).limit(1);if(s)throw s;return[...r,...(c??[]).filter(d=>!r.some(p=>p.id===d.id))].slice(0,e)}async function P({limit:t=4}){const{data:a,error:e}=await n.rpc("get_random_products",{limit_count:t});if(e)throw e;return a}const u=`<article class="product-card">\r
    <div class="product-card__wrapper">\r
        <a href="./product?id={{id}}" class="product-card__link" style="color: black;">\r
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
`,l=g.compile(u),f={"Vitamins & Dietary Supplements":"category--vitamins",Minerals:"category--minerals","Pain Relief":"category--pain",Probiotics:"category--probiotics",Antioxidants:"category--antioxidants","Weight Loss":"category--weight-loss","Prenatal Vitamins":"category--prenatal-vitamins"};function v(t,a,{append:e=!1}={}){if(t=t.map(r=>(r.discount&&(r.oldPrice=r.price,r.price=(r.price*(1-r.discount/100)).toFixed(2)),r.categoryClass=f[r.category]||"category--default",r)),t.length<=2?(a.style.marginRight="auto",a.style.marginLeft="auto"):(a.style.marginRight="",a.style.marginLeft=""),t.length===0){a.innerHTML='<p style="font-size=20px color=red">No items!</p>';return}console.log(t),e?a.insertAdjacentHTML("beforeend",t.map(r=>l(r)).join("")):a.innerHTML=t.map(r=>l(r)).join("")}export{h as a,w as b,P as c,y as g,v as r};
