$(function () {
    function drawEnergyDropdown() {
        const fuelTypes = {
            total: "Total",
            biofuel: "Biofuel",
            biomass: "Biomass",
            geothermal: "Geothermal",
            hydro: "Hydro",
            solar: "Solar",
            wind: "Wind",
            petrol: "Petrol",
            coal: "Coal",
            fossil_fuels: "Fossil Fuels",
            natural_gas: "Natural Gas",
            nuclear: "Nuclear",
            propane: "Propane",
        }

        $('#energyDropdown').empty();
        for (const [key, value] of Object.entries(fuelTypes)) {
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
        let data = {};
        let filters = {
            type: $("input[name='energy-type']:checked").val(),
            fuelType: $("#energyDropdown option:selected").val(),
            sector: $("#sectorDropdown option:selected").val(),
            year: $("#yearpicker option:selected").val(),
        };
        
        axios.get(hostname, {
              params: filters,
          })
          .then(res => data = res)
          .catch(err => console.error(err));

        return data;
    }

    drawEnergyDropdown();
    drawYearDropdown();
    let apiData = getData('http://127.0.0.1:3000/');
    console.log(apiData);


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