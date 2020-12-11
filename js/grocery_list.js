"use strict";

/* make these  global variables so that they can be accessed throughout the page */
let itemList = "";
let groceries;

(function () {

    fetch("../_App_Data/grocery_list.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            groceries = data;
            buildList();
        });

    function buildList(sorted) {
        var container = document.getElementById("grocery_list_container");

        for (let item of groceries) {
            var index = groceries.indexOf(item) + 1; // index +1 to avoid potential html order and tabindex rules. order and tabindex not necessary until sorting.
            var itemTemplate = `<div class="card" role="listitem" style="order:${index};" tabindex="${index}">
                <!-- check that rearranging order does not break accessibility, so added tabindex to for screen readers to read same order as visual -->
                <span class="card--qty accent">
                    QTY: ${item.qty}
                </span>
                <h2 class="card--heading" role="heading">
                    ${item.item}
                </h2>
                <p class="card--content" role="contentinfo">
                    ${item.brand} ${item.type}
                </p>
                <span class="card--category accent">
                    ${item.category}
                </span>
            </div>`;

            itemList += itemTemplate;
        }
        container.innerHTML = itemList;
    }

})();

function sortList(sortBy) {
    /* goal of this function is to find the items in the list and modify the order of presentation in the flexbox an allow unique css animation. 
     * If it presents an issue for screen readers, then we could alternately just re-render the list, purging the old list. */
    var sortedList = groceries.sort(compareValues(sortBy));
    var cards = document.getElementsByClassName('card');

    console.log(sortedList);
    console.log(cards);
}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return comparison;
    };
}
