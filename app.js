const prompt = require('prompt-sync')();

//* VAR
let action;

//* DATA
const users = [
    { id: '658226acdcbecfe9b99d5421', Name: "Matt", Age: 43, updated: Number },
    { id: '65825d1ead6cd90c5c430e24', Name: "Vivienne", Age: 6, updated: Number },
];

//* FUNC
function selectAction() {
    console.log("\nWelcome to the CRM\nType 'q' to Quit\nWhat would you like to do?");
    console.log("\n",
        1, " Create a customer\n",
        2, " View all customers\n",
        3, " Update a Customer\n",
        4, " Delete a customer\n",
        5, " quit",
        "\n"
    );

    action = prompt("Type the number of the action you want to run. ");
    if (action === 'q') return;

    switch (action) {
        case '1':
        case 'create': create(); break;
        case '2':
        case 'read': read(); break
        case '3':
        case 'update': update(); break;
        case '4':
        case 'delete': deleteUser(); break;
    };
}

function create() {
    let newUsers = [];
    console.log("\nEnter a new user in CSV format: <id>, <Name>, <age>\nSeparate each field by comma.\nDo not include labels (i.e. id:, name:).\nDo not wrap names in quotes.\nUse ';' to separate each new user.\nIf you prefer a prompt for each field, type 'p'.\nType 'q' to Quit");
    let input = prompt("New Users: ");
    if (input === 'q') return;

    if (input === 'p') {
        let run = true;
        while (run) {
            const newUser = {};
            newUser['id'] = prompt("User Id: ");
            newUser['Name'] = prompt("Name: ");
            newUser['Age'] = prompt("Age: ");
            newUser['update'] = Date.now();
            console.log(newUser, "\n");

            const confirmation = prompt("Is all the information correct? Type 'q' to Quit. Type 'y' for yes, 'n' for no. ");
            if (confirmation === 'q') return;
            if (confirmation === 'y') {
                users.push(newUser);
                console.log("Do you have more users to add?");
                const loop = prompt("Type 'y' for yes, or 'q' to Quit. ");
                if (loop === 'q') return;
                if (loop !== 'y') break;
            }
            else if (confirmation !== 'n') {
                while (true) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr === 'y') {
                        users.push(newUser);
                        console.log(newUser);
                        run = false;
                    };
                    if (confirmationErr === 'n') break;
                    if (confirmationErr === 'q') return;
                }
            }
        };
    } else {
        const array = input.split(';');
        array.forEach(line => {
            const bits = line.split(',');
            newUsers.push(Object({
                id: bits[0].trim(),
                Name:bits[1].trim(),
                Age: bits.pop().trim(),
                update: Date.now(),
            }));
        })
        console.log("\n", newUsers, newUsers.length + " New Users Created.\n");
        users.push(...newUsers);
        newUsers = [];
    };

    input = prompt("Do you have more to add? Type 'y' for yes, any other key to return to the menu, or 'q' to Quit. ")
    if (input === 'q') return;
    if (input === 'y') create();

    selectAction();
}

function read() {
    let input;
    const last5Users = users.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updated users.\n");
    for (let i = 0; i < 5; i++) {
        if (!last5Users[i]) break;
        console.log(i + 1, "id: " + last5Users[i].id, "Name: " + last5Users[i].Name, "Age: " + last5Users[i].Age);
    }

    console.log("\nTo see all users, type 'a' or 'all', or copy & paste a userID.");
    input = prompt("Type 'q' to Quit. To start over, type any other key. ");
    if (input === 'q') return;

    if (/^a$|^all$/i.test(input)) {
        for (let i = 0; i < users.length; i++) {
            console.log(i + 1, "id: ", last5Users.id, "Name: ", last5Users.name, "Age: ", last5Users.age);
        }
    };

    selectAction();
}

function update() {
    let input, foundUser;
    let list = [];
    const last5Users = users.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updated users.");
    for (let i = 0; i < 5; i++) {
        if (!users[i]) break;
        list.push(last5Users[i - 1]);
        console.log(i + 1, "id: " + last5Users[i].id, "Name: " + last5Users[i].Name, "Age: " + last5Users[i].Age);
    }

    console.log("\nSelect the number of the user you want to update, or paste in the userID of any user.\nTo see all users, type 'a' or 'all'\nType 'q' to Quit.");
    input = prompt("Number or UserID: ");
    if (input === 'q') return;

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Users:");
        for (let i = 0; i < users.length; i++) {
            list.push(last5Users[i - 1]);
            console.log(i + 1, "id: ", last5Users[i].id, "Name: ", last5Users[i].Name, "Age: ", last5Users[i].Age);
        }
        input = prompt("Select the number of the user you want to update, or paste in the userID. ");
        if (input === 'q') return;
    };


    while (true) {
        if (list[input - 1] || users.find(user => user.id === input)) break;
        console.log("Not found! Select the number of the user you want to update, or paste in the userID.\nType 'q' to Quit.")
        input = prompt("Number or userID: ");
        if (input === 'q') return;
    };

    input.length <= 3
        ? foundUser = users.find(user => user.id === list[input].id) //! not sure why this works. Should be input -1, but it's not.
        : foundUser = users.find(user => user.id === input);

    console.log(`\nUpdate ${JSON.stringify(foundUser)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit. ");
    if (input === 'q') return;

    if (geaux === 'y') {
        console.log("\nEnter the information you want to update as key-value pairs in CSV format.\nIf you prefer a prompt for each field, type 'p'\nFormat = id:<userID>, Name:<username>, Age:<age>");

        const result = prompt("Updated Information: ");
        if (result === 'p') {
            console.log("\nEnter new information for each field, or leave unchanged.")
            const updatedUser = {};
            updatedUser['id'] = prompt("id: ", foundUser.id);
            updatedUser['Name'] = prompt("Name: ", foundUser.Name);
            updatedUser['Age'] = prompt("Age: ", foundUser.Age);
            foundUser = updatedUser;
        } else {
            if (result.includes(',')) {
                const parsed = result.split(',');
                parsed.forEach(field => field.split(':').forEach(bit => {
                    foundUser[bit[0]] = bit[1];
                }));
            } else {
                result.split(':').forEach(bit => {
                    foundUser[bit[0]] = bit[1];
                });
            }
        };

        console.log("\n", foundUser);

    } else {
        console.log("Aborted! Please try a new search.");
        update();
    };

    selectAction();
}

function deleteUser() {
    let input, foundUser;
    let list = [];
    const last5Users = users.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updated users.");
    for (let i = 0; i < 5; i++) {
        if (!users[i]) break;
        list.push(last5Users[i - 1]);
        console.log(i + 1, "id: " + last5Users[i].id, "Name: " + last5Users[i].Name, "Age: " + last5Users[i].Age);
    }

    console.log("\nSelect the number of the user you want to delete, or paste in the userID of any user.\nTo see all users, type 'a' or 'all'. Type 'q' to Quit.");
    input = prompt("Number or UserID: ");
    if (input === 'q') return;

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Users:");
        for (let i = 0; i < users.length; i++) {
            list.push(last5Users[i - 1]);
            console.log(i + 1, "id: ", last5Users[i].id, "Name: ", last5Users[i].Name, "Age: ", last5Users[i].Age);
        }
        input = prompt("Select the number of the user you want to delete, or paste in the userID. ");
        if (input === 'q') return;
    };


    while (true) {
        if (list[input - 1] || users.find(user => user.id === input)) break;
        console.log("Not found! Select the number of the user you want to delete, or paste in the userID.\nType 'q' to Quit.")
        input = prompt("Number or userID: ");
        if (input === 'q') return;
    };

    input.length <= 3
        ? foundUser = users.find(user => user.id === list[input - 1].id)
        : foundUser = users.find(user => user.id === input);

    console.log(`\nDelete ${JSON.stringify(foundUser)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit.");
    if (input === 'q') return;

    if (geaux === 'y') {
        delete users.find(user => user.id === foundUser.id);
        console.log("User deleted.");
    } else {
        console.log("Aborted! Please try a new search.");
        deleteUser();
    };

    selectAction();
}

//* RUN
selectAction();