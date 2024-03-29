import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, onValue, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyB5bCSOFHq_XCnfV_j4ZnsGMpVfzAJa6JI",
    authDomain: "endorsement2-41c12.firebaseapp.com",
    projectId: "endorsement2-41c12",
    storageBucket: "endorsement2-41c12.appspot.com",
    messagingSenderId: "1009309521491",
    appId: "1:1009309521491:web:5035a099e01f9af4fcd8a6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const endorsementsRef = ref(database, 'endorsements');

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("input-field");
    const fromField = document.getElementById("from-field");
    const toField = document.getElementById("to-field");
    const endorsementsList = document.getElementById("endorsements-list");
    const publishButton = document.getElementById("publish-button");

    const clickedEndorsements = new Set(JSON.parse(localStorage.getItem('clickedEndorsements')) || []);

    // Listen for changes in the database and update the UI
    onValue(endorsementsRef, (snapshot) => {
        console.log("onValue callback");
        const endorsementsData = snapshot.val();
        endorsementsList.innerHTML = ''; // Clear the existing list

        for (const key in endorsementsData) {
            const endorsementData = endorsementsData[key];
            const listItem = document.createElement("li");
            const endorsementId = key;

            listItem.innerHTML = `
                <p id="to-field1">To ${endorsementData.to}</p>
                <p>${endorsementData.endorsement}</p>
                <p id="from-field1">From ${endorsementData.from}</p>
                <p id="like-counter" data-endorsement-id="${endorsementId}">❤️ ${endorsementData.likes}</p>
            `;

            // Add click event listener to the heart emoji
            const likeCounter = listItem.querySelector("#like-counter");

            likeCounter.addEventListener("click", async () => {
                console.log("Heart Clicked!");

                if (!clickedEndorsements.has(endorsementId)) {
                    const currentLikes = parseInt(likeCounter.innerText.split(" ")[1]);
                    console.log("Current Likes:", currentLikes);
                    likeCounter.innerText = `❤️ ${currentLikes + 1}`;

                    // Update likes in the database
                    console.log("Updating likes in the database");
                    await update(ref(database, `endorsements/${endorsementId}`), {
                        likes: currentLikes + 1
                    });

                    // Mark as clicked
                    clickedEndorsements.add(endorsementId);
                    localStorage.setItem('clickedEndorsements', JSON.stringify(Array.from(clickedEndorsements)));
                }
            });

            // Add list item to endorsements list
            endorsementsList.appendChild(listItem);
        }
    });
});

    // Add click event listener to the publish button
    publishButton.addEventListener("click", function () {
        // Get input values
        const endorsementText = inputField.value;
        const fromText = fromField.value;
        const toText = toField.value;
    
        // Add data to the database
        const newEndorsementRef = push(endorsementsRef);
        update(newEndorsementRef, {
            to: toText,
            endorsement: endorsementText,
            from: fromText,
            likes: 0,  // Asegura que se inicialice en 0
        });
    
        // Clear input fields
        inputField.value = "";
        fromField.value = "";
        toField.value = "";
    });

