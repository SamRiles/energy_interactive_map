$(function () {
    function drawEnergyDropdown(type) {
        const prodTypes = {
            fuel1: 'Coal',
            fuel2: 'Petroleum',
            fuel3: 'Natural Gas',
            fuel4: 'Solar',
            fuel5: 'Wind',
            fuel6: 'Hydro',
            fuel7: 'Geothermal',
            fuel8: 'Wind',
        };
        const conTypes = {
            fuel1: 'Coal',
            fuel2: 'Petroleum',
            fuel3: 'Natural Gas',
        };

        let typeArr = type === 'production' ? prodTypes : conTypes;

        $('#energyDropdown').empty();
        $('#energyDropdown').append('<option value="default">Select Fuel Type</option>');
        for (const [key, value] of Object.entries(typeArr)) {
            $('#energyDropdown').append(`
                <option value="${key}">${value}</option>`
            );
        }
    }
    $(".mapcontainer").mapael({
        map: {
            name: "usa_states",
            defaultArea: {
                size: 30,
                eventHandlers: {
                    mouseover: function (e, id, mapElem, textElem, elemOptions) {
                        // let year = $("#yearpicker").val();
                        let type = $("input[name='energy-type']:checked").val();
                        let fuelType = $("#energyDropdown option:selected").text();
                        $('.myText span').html(`
                            <p>State: ${id}</p>
                            <p>${type}: </p>
                            <p>${fuelType}: </p>
                        `);
                        //write code here
                    }
                    //add more event handlers here
                }
            }
        }
    });
    
    $(".typeSelector").change((e) => {
        drawEnergyDropdown(e.target.value);
    });

    for(let i = new Date().getFullYear() - 3; i > 1959; i--) {
        $('#yearpicker').append(`<option value="${i}">${i}</option>`);
    }
});