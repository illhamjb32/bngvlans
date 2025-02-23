document.addEventListener("DOMContentLoaded", function() {
    const spreadsheetId = '1XYkB8jX4X321SUYiQ7jMj2Mvra44VWT54AQh0-X2iEA';
    const range = 'Sheet1!A2:D'; // Adjust the range to match your sheet and data range
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=AIzaSyCUFkt9vEnXlp-QfUK9359o0U_HA-zvth8`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.values || !Array.isArray(data.values)) {
                throw new Error('Invalid data format');
            }

            const rows = data.values;
            const regionDropdown = document.getElementById('region');
            const vlanInput = document.getElementById('vlan');
            const vlanOptions = document.getElementById('vlanOptions');
            const bngLabel = document.getElementById('bngLabel');
            const nasLabel = document.getElementById('nasLabel');
            const resetButton = document.getElementById('resetButton');
            const modeSwitch = document.getElementById('modeSwitch');
            const card = document.querySelector('.card');

            const regions = [...new Set(rows.map(row => row[0]))];
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionDropdown.appendChild(option);
            });

            regionDropdown.addEventListener('change', () => {
                vlanInput.disabled = false;
                vlanOptions.innerHTML = '';
                const selectedRegion = regionDropdown.value;
                const vlans = [...new Set(rows.filter(row => row[0] === selectedRegion).map(row => row[1]))];
                vlans.forEach(vlan => {
                    const option = document.createElement('option');
                    option.value = vlan;
                    vlanOptions.appendChild(option);
                });
                bngLabel.textContent = 'BNG';
                nasLabel.textContent = 'NAS';
            });

            vlanInput.addEventListener('input', () => {
                const selectedVlan = vlanInput.value;
                const row = rows.find(row => row[1] === selectedVlan && row[0] === regionDropdown.value);
                if (row) {
                    const bng = row[2];
                    const nas = row[3];
                    bngLabel.textContent = `${bng}`;
                    nasLabel.textContent = `NAS: ${nas}`;
                }
            });

            resetButton.addEventListener('click', () => {
                regionDropdown.value = '';
                vlanInput.value = '';
                vlanInput.disabled = true;
                vlanOptions.innerHTML = '';
                bngLabel.textContent = 'BNG';
                nasLabel.textContent = 'NAS';
            });

            modeSwitch.addEventListener('change', () => {
                document.body.classList.toggle('night-mode');
                card.classList.toggle('night-mode');
            });
        })
        .catch(error => console.error('Error fetching spreadsheet data:', error));
});
