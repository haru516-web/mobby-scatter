const key = localStorage.getItem("mobby_scatter_key");
const gender = localStorage.getItem("mobby_scatter_gender");
const typeMap = (gender === "male" && MOBBY.boysTypeMap) ? MOBBY.boysTypeMap : MOBBY.typeMap;
const type = typeMap ? typeMap[key] : undefined;

const nameEl = document.getElementById("typeName");
const descEl = document.getElementById("typeDesc");
const tagsEl = document.getElementById("tags");
const imgEl  = document.getElementById("typeImg");
const officialLink = document.getElementById("officialLink");
const btnRetry = document.getElementById("btnRetry");

function safeFallback(){
  nameEl.textContent = "結果がありません";
  descEl.textContent = "診断ページに戻って回答してね。";
  tagsEl.innerHTML = "";
  imgEl.removeAttribute("src");
}

if(!key || !type){
  safeFallback();
} else {
  nameEl.textContent = type.name;
  descEl.textContent = type.desc;

  tagsEl.innerHTML = "";
  (type.tags || []).forEach(t=>{
    const d = document.createElement("div");
    d.className = "tag";
    d.textContent = t;
    tagsEl.appendChild(d);
  });

  const base = MOBBY.imageBase || "assets/types/";
  if(type.image){
    imgEl.src = encodeURI(`${base}${type.image}`);
  } else if((MOBBY.imageList || []).length){
    const keyNum = Number.parseInt(key, 2);
    const index = Number.isNaN(keyNum) ? 0 : (keyNum * 7) % MOBBY.imageList.length;
    imgEl.src = encodeURI(`${base}${MOBBY.imageList[index]}`);
  } else {
    imgEl.removeAttribute("src");
  }
  imgEl.onerror = ()=>{ imgEl.removeAttribute("src"); };

  officialLink.href = MOBBY.officialUrl;
}

btnRetry.addEventListener("click", ()=>{
  localStorage.removeItem("mobby_scatter_key");
  location.href = "quiz.html";
});
