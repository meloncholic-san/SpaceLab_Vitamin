import{H as k,g as C,a as S,b as P,u as w,T as l}from"./app-YCXN7p87.js";import{g as q,b as I,c as T,r as L}from"./url-bnn_hnyE.js";const F=`<section class="product">\r
    <div class="product__wrapper">\r
        <div class="product__image-wrapper {{categoryClass}}">\r
            <img\r
                class="product__image"\r
                src="./img/components/products/{{image}}.png"\r
                alt="{{title}}"\r
                loading="lazy"\r
            />\r
        </div>\r
\r
        <div class="product__content-wrapper">\r
            <a class="product__backlink" href="">Back to shop</a>\r
            <p class="product__category {{categoryClass}}">{{category}}</p>\r
            <h3 class="product__title">{{title}}</h3>\r
            <div class="product__cart-wrapper">\r
                <div class="product__package-wrapper">\r
                    <svg class="product__package-icon">\r
                        <use href="#{{package.icon}}"></use>\r
                    </svg>\r
                    <div class="product__package__inner">\r
                        <div class="product__package__content">\r
                            <p class="product__package-quantity"><span>{{package.count}}</span> {{package.type}}</p>\r
                            <p class="product__package-desc">{{package.desc}}</p>\r
                        </div>\r
\r
                        <div class="product__cart-quantity">\r
                            <button type="button" class="product__cart-btn-menus"></button>\r
                            <span class="product__cart-count">1</span>\r
                            <button type="button" class="product__cart-btn-plus"></button>\r
                        </div>\r
                    </div>\r
\r
                </div>\r
\r
                <div class="product__order-wrapper">\r
                    <div class="product__autoship">\r
                        <label class="product__autoship-label">\r
                            <div class="product__autoship-content">\r
                                <p class="product__autoship-title"><span class="product__autoship-title-desctop">Autoship this item every</span> <span class="product__autoship-title-mobile">Deliver every</span> </p>\r
                                <div class="product__autoship-frequency">\r
                                    <select class="product__autoship-select">\r
                                        <option value="30">30</option>\r
                                        <option value="60">60</option>\r
                                        <option value="90">90</option>\r
                                    </select>\r
                                </div>\r
                                <p class="product__autoship-title">days</p>\r
                            </div>\r
                            <input type="checkbox" class="product__autoship-checkbox">\r
                            <span class="product__autoship-custom-checkbox"></span>\r
                        </label>\r
                    </div>\r
\r
                    <div class="product__order-content">\r
                        <div class="product__price-wrapper">\r
                        {{#if discount}}\r
                            <span class="product__price--old">\${{oldPrice}}</span>\r
                            <span class="product__price--new">\${{price}}</span>\r
                            <span class="product__sale">-{{discount}}%</span>\r
                        {{else}}\r
                            <span class="product__price--regular">\${{price}}</span>\r
                        {{/if}}\r
                        </div>\r
\r
                        <button type="button" class="product__order-btn">Add to cart</button>\r
                    </div>\r
\r
                </div>\r
            </div>\r
            \r
            <div class="product__description">\r
                <h4 class="product__description-header">Description</h4>\r
                <p class="product__description-phrase">500-C Methoxyflavone is a synergistic formula that features a specialized complex of bioflavonoids combined with vitamin C.*</p>\r
\r
                <ul class="product__description-list">\r
                    <li class="product__description-item">Citrus bioflavonoid complex</li>\r
                    <li class="product__description-item">Provides potent antioxidant protection and supports healthy immune system function*</li>\r
                    <li class="product__description-item">Supports healthy collagen production, the main component of connective tissue*</li>\r
                    <li class="product__description-item">This product is non-GMO, gluten free, and vegetarian</li>\r
                </ul>\r
            </div>\r
\r
            <div class="product__info">\r
                <h4 class="product__info-header">Important information</h4>\r
                <p class="product__info-phrase">Safety information<span class="product__info-detail">Keep out of the reach of children.</span></p>\r
                <p class="product__info-phrase">Indications<span class="product__info-detail">Deficient or weak Immune System Function</span></p>\r
                <p class="product__info-phrase">Ingredients<span class="product__info-detail">Vitamin C (as ascorbic acid), Citrus Bioflavonoid Complex [standardized to 45% (225 mg) bioflavonoids: hesperidin and other naturally occurring phenolic compounds]. Other Ingredients: Cellulose, silica, stearic acid (vegetable), croscarmellose sodium, magnesium stearate (vegetable), and coating (hypromellose, medium chain triglycerides, and hydroxypropylcellulose)..</span></p>\r
                <p class="product__info-phrase">Directions<span class="product__info-detail">Take one tablet daily or as directed by your healthcare practitioner.</span></p>\r
                <p class="product__info-phrase">Legal Disclaimer<span class="product__info-detail">*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. <br> <br> Statements regarding dietary supplements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease or health condition.</span></p>\r
            </div>\r
        </div>\r
    </div>\r
</section>`,A=k.compile(F),D={"Vitamins & Dietary Supplements":"category--vitamins",Minerals:"category--minerals","Pain Relief":"category--pain",Probiotics:"category--probiotics",Antioxidants:"category--antioxidants","Weight Loss":"category--weight-loss","Prenatal Vitamins":"category--prenatal-vitamins"};function R(t){const o=document.querySelector(".product-page__content");t.discount&&(t.oldPrice=t.price,t.price=(t.price*(1-t.discount/100)).toFixed(2)),t.categoryClass=D[t.category]||"category--default",o.innerHTML=A(t)}function E(){l({text:"✅ Added this product to the cart!",duration:3e3,gravity:"top",position:"right",style:{background:"linear-gradient(to right, #00b09b, #96c93d)",borderRadius:"8px",fontSize:"14px",padding:"12px 20px"},stopOnFocus:!0}).showToast()}function $(){l({text:"❌ Failed to add product to cart",duration:3e3,gravity:"top",position:"right",style:{background:"linear-gradient(to right, #ff5f6d, #ffc371)",borderRadius:"8px",fontSize:"14px",padding:"12px 20px"},stopOnFocus:!0}).showToast()}async function z(){const t=q("id");if(!t){console.error("Product ID not found");return}const o=await I(t);R(o);const _=document.querySelector(".product-advertisement__items"),g=await T({category:o.category,excludeId:o.id,limit:4});L(g,_);const h=document.querySelector(".product__backlink");localStorage.setItem("productsPageUrl",document.referrer||"/products"),h.addEventListener("click",e=>{e.preventDefault();const c=localStorage.getItem("productsPageUrl")||"/products";window.location.href=c});const m=document.querySelector(".product__cart-btn-plus"),v=document.querySelector(".product__cart-btn-menus"),i=document.querySelector(".product__cart-count");let a=document.querySelector(".product__price--regular");a||(a=document.querySelector(".product__price--new"));const d=document.querySelector(".product__autoship-checkbox"),p=document.querySelector(".product__autoship");let n=d.checked;d.addEventListener("change",e=>{n=e.target.checked,n?(p.classList.add("product__autoship--active"),console.log(n)):(p.classList.remove("product__autoship--active"),console.log(n))});const s=document.querySelector(".product__autoship-select");s.addEventListener("change",e=>{console.log(s.value)});const y=a.textContent,u=parseFloat(y.replace("$","").trim());let r=1;m.addEventListener("click",()=>{r+=1,i.textContent=r;const e=u*r;a.textContent=`$${e.toFixed(2)}`}),v.addEventListener("click",()=>{r>1&&(r-=1,i.textContent=r);const e=u*r;a.textContent=`$${e.toFixed(2)}`});const f=document.querySelector(".product__order-btn"),{data:{session:b}}=await C(),x=b?.user?.id;f.addEventListener("click",async()=>{const e=await S({productId:o.id,userId:x,quantity:r,autoshipStatus:n,autoshipInterval:n?s.value:null});if(console.log(e),e&&!e.error){E();const c=await P();w(c)}else $()})}export{z as initProduct};
