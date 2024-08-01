
// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js';

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
const auth = getAuth();

// DOM Elements
const addApiaryForm = document.getElementById('addApiaryForm');
const apiaryData = document.getElementById('apiaryData');
const addHiveForm = document.getElementById('addHiveForm');

// Add a new apiary
addApiaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiaryName = document.getElementById('apiaryName').value;
    const apiaryLocation = document.getElementById('apiaryLocation').value;

    const user = auth.currentUser;

    if (user && apiaryName && apiaryLocation) {
        try {
            await addDoc(collection(db, 'apiaries'), {
                userId: user.uid,
                name: apiaryName,
                location: apiaryLocation
            });
            console.log("Apiary added successfully");
            addApiaryForm.reset();
            fetchApiaries();
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

    const user = auth.currentUser;

    if (user) {
        try {
            const apiariesSnapshot = await getDocs(query(collection(db, 'apiaries'), where('userId', '==', user.uid)));
            if (!apiariesSnapshot.empty) {
                apiariesSnapshot.forEach((doc) => {
                    const apiary = doc.data();
                    const apiaryId = doc.id;
                    const apiaryCard = document.createElement('div');
                    apiaryCard.className = 'apiary-section';

                    apiaryCard.innerHTML = `
                        <div class="card">
                            <div class="card-header">
                                <div class="apiary-header">
                                    <h2>${apiary.name}</h2>
                                    <div class="icon-buttons">
                                        <button class="btn btn-primary" onclick="openAddHiveModal('${apiaryId}')">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                        <button class="btn btn-danger" onclick="deleteApiary('${apiaryId}')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <p class="card-text">${apiary.location}</p>
                                <div id="hives-${apiaryId}" class="hive-container"></div>
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
    } else {
        apiaryData.innerHTML = '<p>Please log in to view your apiaries.</p>';
    }
}

// Add a new hive
addHiveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hiveName = document.getElementById('hiveName').value;
    const selectedApiary = document.getElementById('selectedApiary').value;

    const user = auth.currentUser;

    if (user && hiveName) {
        try {
            await addDoc(collection(db, 'apiaries', selectedApiary, 'hives'), {
                userId: user.uid,
                name: hiveName
            });
            console.log("Hive added successfully");
            addHiveForm.reset();
            $('#addHiveModal').modal('hide');
            displayHives(selectedApiary);
        } catch (error) {
            console.error("Error adding hive: ", error);
        }
    } else {
        alert("Please enter a hive name.");
    }
});

// Display hives for a given apiary
async function displayHives(apiaryId) {
    const hivesContainer = document.getElementById(`hives-${apiaryId}`);
    hivesContainer.innerHTML = '';

    const user = auth.currentUser;

    if (user) {
        try {
            const hivesSnapshot = await getDocs(query(collection(db, 'apiaries', apiaryId, 'hives'), where('userId', '==', user.uid)));
            if (!hivesSnapshot.empty) {
                hivesSnapshot.forEach((doc) => {
                    const hive = doc.data();
                    const hiveId = doc.id;

                    const hiveElement = document.createElement('div');
                    hiveElement.className = 'hive-card';
                    hiveElement.innerHTML = `
                        <div class="hive-image">
                            <!-- Optionally add an image or placeholder here -->
                        </div>
                        <div class="hive-info">
                            <div class="hive-name">${hive.name}</div>
                            <div class="hive-meta">
                                <button class="btn btn-secondary btn-small" onclick="viewHiveCondition('${apiaryId}', '${hiveId}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-danger btn-small" onclick="deleteHive('${apiaryId}', '${hiveId}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
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
    } else {
        hivesContainer.innerHTML = '<p>Please log in to view hives.</p>';
    }
}

// Open modal to add a new hive
window.openAddHiveModal = function (apiaryId) {
    $('#addHiveModal').modal('show');
    document.getElementById('selectedApiary').value = apiaryId;
};

// Delete an apiary
window.deleteApiary = async function (apiaryId) {
    if (confirm("Are you sure you want to delete this apiary?")) {
        const user = auth.currentUser;

        if (user) {
            try {
                const apiaryDoc = await getDoc(doc(db, 'apiaries', apiaryId));

                if (apiaryDoc.exists() && apiaryDoc.data().userId === user.uid) {
                    // Delete all hives under the apiary
                    const hivesSnapshot = await getDocs(collection(db, 'apiaries', apiaryId, 'hives'));
                    hivesSnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });

                    // Delete the apiary
                    await deleteDoc(doc(db, 'apiaries', apiaryId));
                    console.log("Apiary deleted successfully");
                    fetchApiaries();
                } else {
                    console.error("Unauthorized or apiary does not exist");
                }
            } catch (error) {
                console.error("Error deleting apiary: ", error);
            }
        } else {
            alert("You must be logged in to delete an apiary.");
        }
    }
}

// Delete a hive
window.deleteHive = async function (apiaryId, hiveId) {
    if (confirm("Are you sure you want to delete this hive?")) {
        const user = auth.currentUser;

        if (user) {
            try {
                const hiveDoc = await getDoc(doc(db, 'apiaries', apiaryId, 'hives', hiveId));

                if (hiveDoc.exists() && hiveDoc.data().userId === user.uid) {
                    await deleteDoc(hiveDoc.ref);
                    console.log("Hive deleted successfully");
                    displayHives(apiaryId);
                } else {
                    console.error("Unauthorized or hive does not exist");
                }
            } catch (error) {
                console.error("Error deleting hive: ", error);
            }
        } else {
            alert("You must be logged in to delete a hive.");
        }
    }
}

// View hive conditions (real data from Firestore)
window.viewHiveCondition = async function (apiaryId, hiveId) {
    const user = auth.currentUser;

    if (user) {
        try {
            const hiveDoc = await getDoc(doc(db, 'apiaries', apiaryId, 'hives', hiveId));

            if (hiveDoc.exists() && hiveDoc.data().userId === user.uid) {
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
                    <p><strong>Sound:</strong> ${sound} dB</p>
                    <p><strong>Weight:</strong> ${weight} kg</p>
                `;
                
                // Optionally, you can add a graph display here using Chart.js or any other library
                // Example:
                // renderHiveWeeklyGraph(hiveData);
                
                $('#hiveConditionModal').modal('show');
            } else {
                console.error("Unauthorized access or hive data not found");
            }
        } catch (error) {
            console.error("Error fetching hive conditions: ", error);
        }
    } else {
        alert("Please log in to view hive conditions.");
    }
}

// Initial load
fetchApiaries();

document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    window.location.href = 'cover.html'; // Redirect to cover.html
});

