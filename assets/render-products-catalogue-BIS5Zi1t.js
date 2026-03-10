import{e as s,H as u}from"./app-Cf6n99bt.js";const o=6;async function y({category:a="all",page:e=1}){let t=s.from("products").select("*").order("created_at",{ascending:!1});a!=="all"&&(a==="sale"?t=t.gt("discount",0):t=t.eq("category",a));const r=(e-1)*o,c=r+o-1,{data:i,error:n}=await t.range(r,c);if(n)throw n;return i}async function w(a){const{data:e,error:t}=await s.from("products").select("*").eq("id",a).single();if(t)throw t;return e}async function P({category:a,excludeId:e,limit:t=4}){const{data:r,error:c}=await s.from("products").select("*").eq("category",a).neq("id",e).order("created_at",{ascending:!1}).limit(t-1);if(c)throw c;const{data:i,error:n}=await s.from("products").select("*").gt("discount",0).neq("id",e).limit(1);if(n)throw n;return[...r,...(i??[]).filter(l=>!r.some(p=>p.id===l.id))].slice(0,t)}async function h({limit:a=4}){const{data:e,error:t}=await s.rpc("get_random_products",{limit_count:a});if(t)throw t;return e}const g=`<article class="product-card">\r
    <div class="product-card__wrapper">\r
        <a href="./product?id={{id}}" class="product-card__link" style="color: black;">\r
            {{#if discount}}\r
                <span class="product-card__sale">-{{discount}}%</span>\r
            {{/if}}\r
\r
            <div class="product-card__image-wrapper">\r
                <img\r
                    class="product-card__image"\r
                    src="./img/components/products/{{image}}.png"\r
                    alt="{{title}}"\r
                    loading="lazy"\r
                />\r
            </div>\r
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
`,d=u.compile(g),f={"Vitamins & Dietary Supplements":"category--vitamins",Minerals:"category--minerals","Pain Relief":"category--pain",Probiotics:"category--probiotics",Antioxidants:"category--antioxidants","Weight Loss":"category--weight-loss","Prenatal Vitamins":"category--prenatal-vitamins"};function v(a,e,{append:t=!1}={}){if(a=a.map(r=>(r.discount&&(r.oldPrice=r.price,r.price=(r.price*(1-r.discount/100)).toFixed(2)),r.categoryClass=f[r.category]||"category--default",r)),a.length===0){e.innerHTML='<p style="font-size=20px color=red">No items!</p>';return}console.log(a),t?e.insertAdjacentHTML("beforeend",a.map(r=>d(r)).join("")):e.innerHTML=a.map(r=>d(r)).join("")}export{w as a,P as b,h as c,y as g,v as r};
