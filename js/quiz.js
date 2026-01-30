const list = document.getElementById("questionList");
const btn = document.getElementById("btnToResult");
const warn = document.getElementById("warn");

const answers = Array(MOBBY.questions.length).fill(null); // "A" or "B"

function makeChoice(qIndex, letter){
  const q = MOBBY.questions[qIndex];
  const data = (letter==="A") ? q.A : q.B;

  const div = document.createElement("div");
  div.className = "choice";
  div.setAttribute("role","button");
  div.tabIndex = 0;
  div.innerHTML = `<strong>${letter}：${data.t}</strong><span>${data.s}</span>`;

  const pick = ()=>{
    answers[qIndex] = letter;
    // toggle selected within this question
    const parent = div.parentElement;
    [...parent.querySelectorAll(".choice")].forEach(c=>c.classList.remove("selected"));
    div.classList.add("selected");
    warn.style.display = "none";
  };
  div.addEventListener("click", pick);
  div.addEventListener("keydown", (e)=>{
    if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pick(); }
  });

  return div;
}

function render(){
  list.innerHTML = "";
  MOBBY.questions.forEach((q, i)=>{
    const item = document.createElement("div");
    item.className = "qItem";
    item.innerHTML = `<p class="qTitle">Q${i+1}. ${q.text}</p>`;

    const choices = document.createElement("div");
    choices.className = "qChoices";
    choices.appendChild(makeChoice(i,"A"));
    choices.appendChild(makeChoice(i,"B"));

    item.appendChild(choices);
    list.appendChild(item);
  });
}

function computeBits(){
  // axisScores[axis] = number of A in its 2 questions
  const axisScores = [0,0,0,0];
  const axisCounts = [0,0,0,0];

  MOBBY.questions.forEach((q, i)=>{
    axisCounts[q.axis] += 1;
    if(answers[i]==="A") axisScores[q.axis] += 1;
  });

  // 2問の多数決：Aが2つなら1、Bが2つなら0、同点は1問目で決める
  const bits = axisScores.map((s, axis)=>{
    if(s===2) return 1;
    if(s===0) return 0;
    const firstIndex = MOBBY.questions.findIndex(q=>q.axis===axis);
    return answers[firstIndex] === "A" ? 1 : 0;
  });
  return bits.join(""); // "1110" など
}

btn.addEventListener("click", ()=>{
  const missing = answers.findIndex(a=>a===null);
  if(missing !== -1){
    warn.textContent = `未回答があります（Q${missing+1}）。AかBを選んでね！`;
    warn.style.display = "";
    // スクロール誘導
    const target = list.children[missing];
    target?.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  const key = computeBits();
  localStorage.setItem("mobby_scatter_key", key);
  location.href = "result.html";
});

render();
