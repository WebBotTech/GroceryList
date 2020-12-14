"use strict";

/* make these  global variables so that they can be accessed throughout the page */
let itemList = "";
let groceries;
let sortedList;
let container = document.getElementById("grocery_list_container");

/* get the list on page load then render it */
(function () {

    fetch("../_App_Data/grocery_list.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            groceries = data;
            buildList();
        });

})();

function buildList(sortBy) {
    /* initialize the list with the original grocery list.
     * re-render the list if sorted. 
     * future goal is to see if we can just traverse the DOM and change the order attribute using the sorted list instead of re-rendering.
     * screen reader compatiblity may force to keep this function instead of changing the order live */

    /* reset the template and the page, otherwise the rendered list will keep compounding */
    //container.querySelectorAll("div").forEach(n => n.remove()); // not needed. will be replaced at the end of the function.
    itemList = '';

    if (sortBy === ('groceries' || 'undefined')) {
        sortedList = groceries;
    } else {
        sortedList = groceries.sort(compareValues(sortBy));
    }

    for (let item of sortedList) {
        var index = sortedList.indexOf(item) + 1; // index +1 to avoid potential html order and tabindex rules. order and tabindex not necessary until sorting.
        var itemTemplate = `<div class="card card--hidden" role="listitem" style="order:${index};" tabindex="${index}">
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
    //render list
    container.innerHTML = itemList;
 
    showCards(container);
}

// show list my individual items
function showCards(container) {
    var cards = document.getElementsByClassName('card');
    var timer = 1;
    for (let element of cards) {
        setTimeout(function () {
            return element.classList.remove("card--hidden");
        }, 750 * timer);
        timer++;
    }
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