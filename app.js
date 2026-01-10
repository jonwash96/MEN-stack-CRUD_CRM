const prompt = require('prompt-sync')();

//* VAR
let action;

//* DATA
const users = [
    { id: '658226acdcbecfe9b99d5421', name: "Matt", age: 43, updated: Number },
    { id: '65825d1ead6cd90c5c430e24', name: "Vivienne", age: 6, updated: Number },
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
    console.log("\nEnter a new user in CSV format: <id>, <name>, <age>\n Separate each field by comma.\n Do not include labels (i.e. id:, name:).\n Do not wrap names in quotes.\n Use ';' to separate each new user.\nIf you prefer a prompt for each field, type 'p'.\nType 'q' to Quit");
    let input = prompt("New Users: ");
    if (input === 'q') return;

    if (input === 'p') {
        let run = true;
        while (run) {
            const newUser = {};
            newUser['id'] = prompt("User Id: ");
            newUser['name'] = prompt("name: ");
            newUser['age'] = prompt("age: ");
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
        let run = true;
        while (run) {
            const array = input.split(';');
            array.forEach(line => {
                const bits = line.split(',');
                newUsers.push(Object({
                    id: bits[0].trim(),
                    name:bits[1].trim(),
                    age: bits.pop().trim(),
                    update: Date.now(),
                }))
            });
            console.log("\n", newUsers, "\nCreating "+newUsers.length + " New Users.\n");
            input = prompt("Does the above information look correct? Type 'y' for yes, 'n' for no, or 'q' to Quit. ");
            if (input==='q') return;
            if (input==='y') break;

            while (run) {
                const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                if (confirmationErr==='q') return;
                if (confirmationErr === 'y') run = false;
                if (confirmationErr==='n') return(create());
            }
        };

        users.push(...newUsers);
        newUsers = [];
    };

    input = prompt("Do you have more to add? Type 'y' for yes, or 'enter' to return to the menu, or 'q' to Quit. ")
    if (input === 'q') return;
    if (input === 'y') return(create());

    selectAction();
}

function read() {
    let input, foundUser;
    let list = [];
    const last5Users = users.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updated users.");
    for (let i = 0; i < 5; i++) {
        list.push(last5Users[i]);
        if (!last5Users[i]) break;
        console.log(i + 1, "id: " + last5Users[i].id, "name: " + last5Users[i].name, "age: " + last5Users[i].age);
    }

    console.log("\nTo see all users, type 'a' or 'all'.\nTo inspect a specific user, type the number or enter a userID.");
    input = prompt("Type 'q' to Quit. To return to the main menu, type any other key. ");
    if (input === 'q') return;

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Users:");
        for (let i = 0; i < users.length; i++) {
            list.push(users[i]);
            console.log(i + 1, "id: ", users[i].id, "name: ", users[i].name, "age: ", users[i].age);
        };
        console.log("\nTo inspect a specific user, type the number or enter a userID.");
        input = prompt("Type 'q' to Quit. To return to the main menu, type any other key. ");
        if (input === 'q') return;
    };

    while (true) {
        if (list[input - 1] || users.find(user => user.id === input)) break;
        console.log("\nNot found! Select the number of the user you want to update, or paste in the userID.\nType 'q' to Quit or 'a' to view all.")
        input = prompt("Number or userID: ");
        if (input === 'q') return;
        if (input==='a') return read();
    };

    input.length <= 3
        ? foundUser = users.find(user => user.id === list[input -1].id)
        : foundUser = users.find(user => user.id === input);

    console.log("\n", foundUser);
    // console.log("\nActions:", 1, "Update Customer", 2, "Delete Customer", 3, "View All Customers");
    input = prompt("\nType 'q' to Quit, 'a' to view all users, or 'enter' to return to the main menu. ");
    switch (input) {
        case '1': update(foundUser.id); break;
        case '2': deleteUser(foundUser.id); break;
        case 'a': 
        case '3': read(); break;
        case 'q': return selectAction(); break;
    };
    return selectAction();
}

function update() {
    let input, foundUser;
    let list = [];
    const last5Users = users.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updated users.");
    for (let i = 0; i < 5; i++) {
        if (!users[i]) break;
        list.push(last5Users[i]);
        console.log(i + 1, "id: " + last5Users[i].id, "name: " + last5Users[i].name, "age: " + last5Users[i].age);
    }

    console.log("\nSelect the number of the user you want to update, or paste in the userID of any user.\nTo see all users, type 'a' or 'all'\nType 'q' to Quit.");
    input = prompt("Number or UserID: ");
    if (input === 'q') return;

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Users:");
        for (let i = 0; i < users.length; i++) {
            list.push(last5Users[i]);
            console.log(i + 1, "id: ", last5Users[i].id, "name: ", last5Users[i].name, "age: ", last5Users[i].age);
        };
        input = prompt("\nSelect the number of the user you want to update, or paste in the userID. ");
        if (input === 'q') return;
    };


    while (true) {
        if (list[input - 1] || users.find(user => user.id === input)) break;
        console.log("Not found! Select the number of the user you want to update, or paste in the userID.\nType 'q' to Quit.")
        input = prompt("Number or userID: ");
        if (input === 'q') return;
    };

    input.length <= 3
        ? foundUser = users.find(user => user.id === list[input -1].id)
        : foundUser = users.find(user => user.id === input);

    console.log(`\nUpdate ${JSON.stringify(foundUser)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit. ");
    if (input === 'q') return;

    if (geaux === 'y') {
        let run = true;
        let updatedUser = {};
        while (run) {
        console.log("\nEnter the information you want to update as key-value pairs in CSV format.\nIf you prefer a prompt for each field, type 'p'\nFormat = id:<userID>, name:<username>, age:<age>");
        const result = prompt("Updated Information: ");

            if (result === 'p') {
                console.log("\nEnter new information for each field, or leave unchanged.")
                updatedUser['id'] = prompt("id: ", foundUser.id);
                updatedUser['name'] = prompt("name: ", foundUser.name);
                updatedUser['age'] = prompt("age: ", foundUser.age);
            } else {
                updatedUser = Object.create(foundUser);
                if (result.includes(',')) {
                    result.split(',').forEach(pair => {
                        const bits = pair.split(':');
                        bits.forEach(bit => {
                            updatedUser[bits[0].trim()] = bits[1].trim();
                        })
                    });
                } else {
                    const bits = result.split(':').map(bit => bit.trim());
                    updatedUser[bits[0]] = bits[1];
                }
            };
            
            updatedUser.updated = Date.now();
            console.log("\n", updatedUser);
    
            input = prompt("Does the above information look correct? Type 'y' for yes, 'n' for no, or 'q' to Quit. ");
            if (input==='q') {return;
            } else if (input==='y') {break;
            } else if (input==='n') {null;
            } else {
                while (run) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr==='q') return;
                    if (confirmationErr === 'y') run = false;
                    if (confirmationErr==='n') break;
                }
            }
        };
        foundUser = updatedUser;

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
        list.push(last5Users[i]);
        console.log(i + 1, "id: " + last5Users[i].id, "name: " + last5Users[i].name, "age: " + last5Users[i].age);
    }

    console.log("\nSelect the number of the user you want to delete, or paste in the userID of any user.\nTo see all users, type 'a' or 'all'. Type 'q' to Quit.");
    input = prompt("Number or UserID: ");
    if (input === 'q') return;

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Users:");
        for (let i = 0; i < users.length; i++) {
            list.push(last5Users[i]);
            console.log(i + 1, "id: ", last5Users[i].id, "name: ", last5Users[i].name, "age: ", last5Users[i].age);
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
        users.splice(users.findIndex(user => user.id === foundUser.id), 1);
        console.log("User deleted.");
    } else {
        console.log("Aborted! Please try a new search.");
        deleteUser();
    };

    selectAction();
}

//* RUN
selectAction();