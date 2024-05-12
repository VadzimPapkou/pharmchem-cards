let areCardsLoading = true;

const password = window.prompt("ПАРОЛЬ?");
document.cookie = "password=" + password;

async function main() {
  const response = await fetch("/cards");
  if(response.status === 401) window.location.href = "/401";
  let cards = await response.json();
  const nullToEmpty = str => String(str) === "null" ? "" : String(str);
  cards = cards.map(card => {
    const $card = fromHTML(
      `<div class="card" data-id="${card.id}">
        <img class="formula" src="${"data:image/png;base64, " + card.formula}" />
        <button class="close-btn">Скрыть инфу</button>
        <button class="update-btn">Обновить карточку</button>
        <table class="card-table">
                <tr>
                  <th>Название</th>
                  <td data-property="name" contenteditable style="text-transform: uppercase; font-weight: bold">${nullToEmpty(card.name)}</td>
                </tr>
                <tr>
                  <th>Показания</th>
                  <td data-property="pharmacology" contenteditable>${nullToEmpty(card.pharmacology)}</td>
                </tr>
                <tr>
                  <th>Механизм д-я</th>
                  <td data-property="mechanism" contenteditable>${nullToEmpty(card.mechanism)}</td>
                </tr>
                <tr>
                  <th>Производное чего</th>
                  <td data-property="derivate" contenteditable>${nullToEmpty(card.derivate)}</td>
                </tr>
                <tr>
                  <th>Торговые</th>
                  <td data-property="tradename" contenteditable>${nullToEmpty(card.tradename)}</td>
                </tr> 
                <tr>
                  <th>Идентификация</th>
                  <td data-property="identification" contenteditable>${nullToEmpty(card.identification)}</td>
                </tr> 
                <tr>
                  <th>КО</th>
                  <td data-property="quantification" contenteditable>${nullToEmpty(card.quantification)}</td>
                </tr>         
        </table>    
    </div>`);

    return {
      ...card,
      $el: $card
    }
  });

  window.cards = cards;

  areCardsLoading = false;
  const lessons = {};
  cards.forEach(card => lessons[card.lesson] = 1);
  const checkboxes = Object.keys(lessons).map((lesson) => `<label class="lesson-checkbox">
    <input type="checkbox" checked="checked" name="lesson" value=${lesson} onchange="handleLessonChange(this)">${lesson}
  </label>`).join("\n");
  document.body.insertAdjacentElement("afterbegin", fromHTML(`<div class="lessons">${checkboxes}</div>`));
  document.body.insertAdjacentElement("afterbegin", fromHTML(`<button class="shuffle-btn">Перемешать</button>`));
  handleLessonChange();
}

document.addEventListener("click", e => {
  const closestCard = e.target.classList.contains("card") ? e.target : e.target.closest(".card");
  if(!closestCard) return;

  const isOpen = closestCard.classList.contains("open");
  if(isOpen) {
    if(e.target.classList.contains("close-btn")) {
      closestCard.classList.remove("open");
    }
  } else {
    closestCard.classList.add("open");
  }
});

document.addEventListener("click", async e => {
  if(!e.target.classList.contains("update-btn")) return;

  const closestCard = e.target.closest(".card");
  const entries = [...closestCard.querySelectorAll("[data-property]")].map($prop => [$prop.dataset.property, $prop.innerText]);
  const cardData = Object.fromEntries(entries);
  try {
    const response = await fetch("/cards/" + closestCard.dataset.id, {
      method: "put",
      body: JSON.stringify(cardData),
      headers: {
        "Content-Type": "application/json"
      }
    });
    addNotification("Успех", "success")
  } catch (e) {
    addNotification(e, "error");
  }
});

document.addEventListener("click", e => {
  if(!e.target.classList.contains("shuffle-btn")) return;

  let shuffled = [...document.querySelectorAll(".card")]
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  document.querySelector(".cards").innerHTML = "";
  document.querySelector(".cards").append(...shuffled);
})

function handleLessonChange(e) {
  const checkedLessons = [...document.querySelectorAll(".lesson-checkbox input:checked")].map($el => $el.value);
  console.log(checkedLessons);
  const $cards = document.querySelector(".cards");
  $cards.innerHTML = "";
  window.cards.filter(card => checkedLessons.includes(card.lesson)).forEach(card => $cards.append(card.$el));
}

function addNotification(text, className = "") {
  const $notification = fromHTML(`<div class="notification ${className}">${text}</div>`);
  document.querySelector(".notifications").append(
    $notification
  );
  setTimeout(() => {
    $notification.remove()
  }, 2000);
}

main();

