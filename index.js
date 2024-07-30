
// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3ANmOdzhjPgxWq91vx_qnpVMpDq-qhig",
    authDomain: "projectmain1-44cce.firebaseapp.com",
    databaseURL: "https://projectmain1-44cce-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "projectmain1-44cce",
    storageBucket: "projectmain1-44cce.appspot.com",
    messagingSenderId: "592837634615",
    appId: "1:592837634615:web:ca63818dd7101534dc6db2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const addApiaryForm = document.getElementById('addApiaryForm');
const apiaryData = document.getElementById('apiaryData');
const addHiveForm = document.getElementById('addHiveForm');

// Add a new apiary
addApiaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiaryName = document.getElementById('apiaryName').value;
    const apiaryLocation = document.getElementById('apiaryLocation').value;

    if (apiaryName && apiaryLocation) {
        try {
            await addDoc(collection(db, 'apiaries'), {
                name: apiaryName,
                location: apiaryLocation
            });
            console.log("Apiary added successfully");
            addApiaryForm.reset();
            fetchApiaries(); // Refresh the list
        } catch (error) {
            console.error("Error adding apiary: ", error);
        }
    } else {
        alert("Please fill in all fields.");
    }
});

// Fetch and display apiaries
async function fetchApiaries() {
    apiaryData.innerHTML = '';
    try {
        const apiariesSnapshot = await getDocs(collection(db, 'apiaries'));
        if (!apiariesSnapshot.empty) {
            apiariesSnapshot.forEach((doc) => {
                const apiary = doc.data();
                const apiaryId = doc.id;
                const apiaryCard = document.createElement('div');
                apiaryCard.className = 'col-md-4';

                apiaryCard.innerHTML = `
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${apiary.name}</h5>
                            <p class="card-text">${apiary.location}</p>
                            <button class="btn btn-primary btn-small" onclick="openAddHiveModal('${apiaryId}')">
                                <i class="fas fa-plus"></i> Add Hive
                            </button>
                            <button class="btn btn-danger btn-small" onclick="deleteApiary('${apiaryId}')">
                                <i class="fas fa-trash"></i> Delete Apiary
                            </button>
                            <div id="hives-${apiaryId}" class="mt-3"></div>
                        </div>
                    </div>
                `;
                apiaryData.appendChild(apiaryCard);

                displayHives(apiaryId);
            });
        } else {
            apiaryData.innerHTML = '<p>No apiaries found. Add a new apiary above.</p>';
        }
    } catch (error) {
        console.error("Error fetching apiaries: ", error);
        apiaryData.innerHTML = '<p>Error fetching apiaries. Check the console for more details.</p>';
    }
}

// Display hives for a given apiary
async function displayHives(apiaryId) {
    const hivesContainer = document.getElementById(`hives-${apiaryId}`);
    hivesContainer.innerHTML = '';

    try {
        const hivesSnapshot = await getDocs(collection(db, 'apiaries', apiaryId, 'hives'));
        if (!hivesSnapshot.empty) {
            hivesSnapshot.forEach((doc) => {
                const hive = doc.data();
                const hiveId = doc.id;

                const hiveElement = document.createElement('div');
                hiveElement.className = 'card mt-2';
                hiveElement.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title">${hive.name}</h6>
                        <button class="btn btn-secondary btn-small" onclick="viewHiveCondition('${apiaryId}', '${hiveId}')">
                            <i class="fas fa-eye"></i> View Conditions
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteHive('${apiaryId}', '${hiveId}')">
                            <i class="fas fa-trash"></i> Delete Hive
                        </button>
                    </div>
                `;
                hivesContainer.appendChild(hiveElement);
            });
        } else {
            hivesContainer.innerHTML = '<p>No hives found for this apiary.</p>';
        }
    } catch (error) {
        console.error("Error fetching hives: ", error);
        hivesContainer.innerHTML = '<p>Error fetching hives. Check the console for more details.</p>';
    }
}

// Open modal to add a new hive
window.openAddHiveModal = function (apiaryId) {
    $('#addHiveModal').modal('show');
    document.getElementById('selectedApiary').value = apiaryId;
};

// Add a new hive
addHiveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hiveName = document.getElementById('hiveName').value;
    const selectedApiary = document.getElementById('selectedApiary').value;

    if (hiveName) {
        try {
            await addDoc(collection(db, 'apiaries', selectedApiary, 'hives'), {
                name: hiveName,
                // Add more hive details here if needed
            });
            console.log("Hive added successfully");
            addHiveForm.reset();
            $('#addHiveModal').modal('hide');
            displayHives(selectedApiary); // Refresh hives list for the selected apiary
        } catch (error) {
            console.error("Error adding hive: ", error);
        }
    } else {
        alert("Please enter a hive name.");
    }
});

// Delete an apiary
window.deleteApiary = async function (apiaryId) {
    if (confirm("Are you sure you want to delete this apiary?")) {
        try {
            // Delete all hives under the apiary
            const hivesSnapshot = await getDocs(collection(db, 'apiaries', apiaryId, 'hives'));
            hivesSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Delete the apiary
            await deleteDoc(doc(db, 'apiaries', apiaryId));
            console.log("Apiary deleted successfully");
            fetchApiaries(); // Refresh the list
        } catch (error) {
            console.error("Error deleting apiary: ", error);
        }
    }
}

// Delete a hive
window.deleteHive = async function (apiaryId, hiveId) {
    if (confirm("Are you sure you want to delete this hive?")) {
        try {
            await deleteDoc(doc(db, 'apiaries', apiaryId, 'hives', hiveId));
            console.log("Hive deleted successfully");
            displayHives(apiaryId); // Refresh the hives list for the apiary
        } catch (error) {
            console.error("Error deleting hive: ", error);
        }
    }
}

// View hive conditions (real data from Firestore)
window.viewHiveCondition = async function (apiaryId, hiveId) {
    try {
        const hiveDoc = await getDoc(doc(db, 'apiaries', apiaryId, 'hives', hiveId));
        if (hiveDoc.exists()) {
            const hiveData = hiveDoc.data();

            // Assuming hiveData contains fields like temperature, humidity, sound, and weight
            const temperature = hiveData.temperature || 'N/A';
            const humidity = hiveData.humidity || 'N/A';
            const sound = hiveData.sound || 'N/A';
            const weight = hiveData.weight || 'N/A';

            const hiveConditionDetails = document.getElementById('hiveConditionDetails');
            hiveConditionDetails.innerHTML = `
                <p><strong>Temperature:</strong> ${temperature}°C</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Sound:</strong> ${sound} dB</p> <!-- Assuming sound is in decibels -->
                <p><strong>Weight:</strong> ${weight} kg</p> <!-- Assuming weight is in kilograms -->
            `;
            
            // Optionally, you can add a graph display here using Chart.js or any other library
            // Example:
            // renderHiveWeeklyGraph(hiveData);
            
            $('#hiveConditionModal').modal('show');
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error fetching hive conditions: ", error);
    }
};

// Example function to render a graph using Chart.js
function renderHiveWeeklyGraph(data) {
    const ctx = document.getElementById('hiveWeeklyGraph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Temperature',
                    data: data.temperatures,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Humidity',
                    data: data.humidities,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Sound',
                    data: data.sounds, // Ensure you have sound data
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Weight',
                    data: data.weights, // Ensure you have weight data
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Initial load
fetchApiaries();

document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    window.location.href = 'cover.html'; // Redirect to cover.html
});
