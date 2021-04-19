$(function () {
    $(".mapcontainer").mapael({
        map: {
            name: "usa_states",
            defaultArea: {
                size: 30,
                eventHandlers: {
                    mouseover: function (e, id, mapElem, textElem, elemOptions) {
                        // if (typeof elemOptions.myText != 'undefined') {
                            // $('.myText span').html(elemOptions.myText).css({display: 'none'}).fadeIn('slow');
                            $('.myText span').html("<p>Data for " + id + "</p>");
                        // }
                    }
                }
            }
        }
    });
});