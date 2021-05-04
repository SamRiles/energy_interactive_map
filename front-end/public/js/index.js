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

    function drawMapael() {
        $(".mapcontainer").mapael({
            map: {
                name: "usa_states",
                zoom: {
                    enabled: true
                },
                defaultArea: {
                    size: 30,
                    eventHandlers: {
                        mouseover: function (e, id, mapElem, textElem, elemOptions) {
                            var result = apiData.filter(obj => {
                                return obj.state_id === id
                            });
                            let type = $("input[name='energy-type']:checked").val();
                            let fuelType = $("#energyDropdown option:selected").text();
                            $('.myText span').html(`
                                <p>State: ${result[0].state_name}</p>
                                <p>Year: ${result[0].year}</p>
                                <p>${fuelType} ${type}: ${result[0].data.toLocaleString()} BTUs</p>
                            `);
                        }
                    },
                    attrsHover: {
                        animDuration: 100
                    },
                    tooltip: {
                        content: (e) => { 
                            var result = apiData.filter(obj => {
                                return obj.state_id === e.node.dataset.id
                            });
                            let type = $("input[name='energy-type']:checked").val();
                            let fuelType = $("#energyDropdown option:selected").text();
                            return `
                            <p>State: ${result[0].state_name}</p>
                            <p>Year: ${result[0].year}</p>
                            <p>${fuelType} ${type}: ${result[0].data.toLocaleString()} BTUs</p>
                        `;
                        }
                    },
                }
            }
        });
    }
    
    function loadSpinner() {
        $(".mapcontainer").hide();
        $(".loader").show();
        $('.myText span').text("Hover over a state to see data");
        setTimeout(() => {
            $(".loader").hide();
            $(".mapcontainer").show();
        }, 1500);
    }

    async function getData(hostname) {
        let data = {};
        let filters = {
            type: $("input[name='energy-type']:checked").val(),
            fuelType: $("#energyDropdown option:selected").val(),
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
    getData('https://api.cs366project.live/')
    .then((data) => { 
        apiData = data;
    });
    drawMapael();

    $("#submit-filter-btn").click(() => {
        loadSpinner();
        getData('https://api.cs366project.live/')
        .then((data) => { 
            apiData = data;
        });
    });
});