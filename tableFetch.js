fetch('elementTable.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('elementTable-placeholder').innerHTML = data;
            });