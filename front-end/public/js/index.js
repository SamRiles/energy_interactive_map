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

    async function getData(hostname) {
        let data = {};
        let filters = {
            type: $("input[name='energy-type']:checked").val(),
            fuelType: $("#energyDropdown option:selected").val(),
            sector: $("#sectorDropdown option:selected").val(),
            year: $("#yearpicker option:selected").val(),
        };

        try {
            return (await axios.get(hostname, {
                params: filters
            })).data
        } catch (error) {
            console.error(error);
        }
    }

    drawEnergyDropdown();
    drawYearDropdown();
    let apiData;
    getData('http://127.0.0.1:3000/')
    .then((data) => { 
        apiData = data;
    });

    $("#submit-filter-btn").click(() => {
        getData('http://127.0.0.1:3000/')
        .then((data) => { 
            apiData = data;
        });
    });

    $(".mapcontainer").mapael({
        map: {
            name: "usa_states",
            defaultArea: {
                size: 30,
                eventHandlers: {
                    mouseover: function (e, id, mapElem, textElem, elemOptions) {
                        let year = $("#yearpicker").val();
                        var result = apiData.filter(obj => {
                            return obj.state_id === id
                        });
                        let type = $("input[name='energy-type']:checked").val();
                        let fuelType = $("#energyDropdown option:selected").text();
                        $('.myText span').html(`
                            <p>State: ${id}</p>
                            <p>${fuelType} ${type}: ${result[0].data} BTUs</p>
                        `);
                    }
                }
            }
        }
    });
});