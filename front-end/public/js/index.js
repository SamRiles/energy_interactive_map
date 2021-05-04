$(function () {
    function drawEnergyDropdown(type) {
        const prodTypes = {
            all: 'All Fuel Types',
            coal: 'Coal',
            petrol: 'Petroleum',
            gas: 'Natural Gas',
            solar: 'Solar',
            wind: 'Wind',
            hydro: 'Hydro',
            geothermal: 'Geothermal',
        };
        const conTypes = {
            all: 'All Fuel Types',
            coal: 'Coal',
            petrol: 'Petroleum',
            gas: 'Natural Gas',
        };

        let typeArr = type === 'production' ? prodTypes : conTypes;

        $('#energyDropdown').empty();
        for (const [key, value] of Object.entries(typeArr)) {
            $('#energyDropdown').append(`
                <option value="${key}">${value}</option>`
            );
        }
    }

    function drawYearDropdown() {
        for(let i = new Date().getFullYear() - 3; i > 1959; i--) {
            $('#yearpicker').append(`<option value="${i}">${i}</option>`);
        }
    }

    function getData(hostname) {
        let filters = {
            type: $("input[name='energy-type']:checked").val(),
            fuelType: $("#energyDropdown option:selected").val(),
            // sector: $("#sectorDropdown option:selected").val(),
            year: $("#yearpicker option:selected").val(),
        };

        axios.get(hostname, {
              params: filters,
          })
          .then(res => console.log(res))
          .catch(err => console.error(err));
    }

    drawEnergyDropdown('consumption');
    drawYearDropdown();
    getData('http://127.0.0.1:3000/');

    $(".typeSelector").change((e) => {
        drawEnergyDropdown(e.target.value);
    });

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
});