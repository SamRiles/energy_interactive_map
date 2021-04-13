$(document).ready(function() {
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
    
    $('.typeSelector').change((e) => {
        drawEnergyDropdown(e.target.value);
    });

});